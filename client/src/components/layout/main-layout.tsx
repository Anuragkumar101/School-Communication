import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import BottomNavigation from "./bottom-navigation";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "@/components/auth/auth-modal";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentUser, loading } = useAuth();

  // Show auth modal if not logged in and not loading
  const shouldShowAuthModal = !loading && !currentUser;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-16 md:pb-6">
          {shouldShowAuthModal ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Welcome to SchoolConnect</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please sign in to connect with your school friends
                </p>
              </div>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:bg-primary/90 transition-colors"
              >
                Sign In or Create Account
              </button>
            </div>
          ) : (
            <>{children}</>
          )}
        </main>
      </div>
      
      <BottomNavigation />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;
