import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB9cLcIa8N3lHj_LfEotm11xgyWnj-jlQw",
  authDomain: "schoolconnect-d7064.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "schoolconnect-d7064",
  storageBucket: "schoolconnect-d7064.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "753560091419",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:753560091419:web:5a7665df668dae108cf1be",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GBF7PXXTC0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics
let analytics: any = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.error("Firebase analytics is not supported in this environment", error);
}
export { analytics };

// Initialize Messaging for push notifications
let messaging: any = null;
// Only try to initialize messaging if we're in a browser that likely supports it
// and we're not in a Replit webview
const isSupportedBrowser = typeof window !== 'undefined' && 
                          'serviceWorker' in navigator && 
                          window.location.hostname !== 'replit.com' &&
                          !window.location.hostname.includes('.replit.dev');

if (isSupportedBrowser) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn("Firebase messaging is not supported in this browser", error);
  }
} else {
  console.log("Firebase messaging initialization skipped - unsupported environment");
}

// Authentication functions
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const registerWithEmailPassword = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error("Error signing up with email/password:", error);
    throw error;
  }
};

export const logInWithEmailPassword = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email/password:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Push notification permission request
export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.log("Push notifications are not supported in this environment");
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Only try to get token if we have a VAPID key
      if (import.meta.env.VITE_FIREBASE_VAPID_KEY) {
        try {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });
          return token;
        } catch (tokenError) {
          console.warn("Could not get notification token:", tokenError);
          return null;
        }
      } else {
        console.log("VAPID key not provided - push notifications disabled");
        return null;
      }
    }
    return null;
  } catch (error) {
    console.warn("Error requesting notification permission:", error);
    return null;
  }
};
