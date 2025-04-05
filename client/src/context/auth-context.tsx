import { createContext, useEffect, useState, ReactNode } from "react";
import { auth, signInWithGoogle, logInWithEmailPassword, registerWithEmailPassword, logOut } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, displayName: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => null,
  signInWithEmail: async () => null,
  signUp: async () => null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // When user logs in, sync with backend
          await apiRequest("POST", "/api/users/sync", {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } catch (error) {
          console.error("Error syncing user with backend:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmailWrapper = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await logInWithEmailPassword(email, password);
      return user;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUpWrapper = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const user = await registerWithEmailPassword(email, password, displayName);
      return user;
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleWrapper = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      return user;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logoutWrapper = async () => {
    try {
      await logOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle: signInWithGoogleWrapper,
    signInWithEmail: signInWithEmailWrapper,
    signUp: signUpWrapper,
    logout: logoutWrapper,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
