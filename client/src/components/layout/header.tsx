import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, MenuIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import ProfileDropdown from "@/components/profile/profile-dropdown";
import AuthModal from "@/components/auth/auth-modal";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { currentUser, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-primary text-primary-foreground py-2 px-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            onClick={onToggleSidebar}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-xl font-bold">LOYAL COMMUNITY</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!loading && (
            <>
              {currentUser ? (
                <ProfileDropdown user={currentUser} />
              ) : (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Login
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
