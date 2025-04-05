import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoonIcon, 
  SunIcon, 
  BellIcon, 
  BellOffIcon, 
  ShieldIcon, 
  KeyIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from "lucide-react";
import { requestNotificationPermission } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { useAdmin } from "@/context/admin-context";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { isAdmin, validateAdminCode } = useAdmin();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showAdminSection, setShowAdminSection] = useState(false);
  
  // Check if notifications are enabled
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if (!("Notification" in window)) {
        return;
      }
      
      const permission = Notification.permission;
      setNotificationsEnabled(permission === "granted");
    };
    
    checkNotificationPermission();
  }, []);
  
  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      toast({
        description: "Please disable notifications in your browser settings",
      });
      return;
    }
    
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setNotificationsEnabled(true);
        toast({
          description: "Notifications enabled successfully",
        });
      } else {
        toast({
          title: "Permission denied",
          description: "Please allow notifications in your browser settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleAdminSection = () => {
    setShowAdminSection(!showAdminSection);
  };
  
  const handleAdminCodeSubmit = () => {
    const isValid = validateAdminCode(adminCode);
    
    if (isValid) {
      toast({
        title: "Success",
        description: "Admin access granted",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid admin code",
        variant: "destructive",
      });
    }
    
    setAdminCode("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === "dark" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
              <Label htmlFor="theme-mode">Dark Mode</Label>
            </div>
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={handleToggleTheme}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notificationsEnabled ? (
                <BellIcon className="h-5 w-5" />
              ) : (
                <BellOffIcon className="h-5 w-5" />
              )}
              <Label htmlFor="push-notifications">Push Notifications</Label>
            </div>
            <Switch
              id="push-notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Receive notifications for new messages, homework deadlines, and schedule changes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Offline Mode</CardTitle>
          <CardDescription>
            Access your data when offline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            SchoolConnect automatically stores your data for offline access. The data will sync when you're back online.
          </p>
          
          <Button variant="outline">
            Clear Cache
          </Button>
        </CardContent>
      </Card>
      
      {/* Secret Admin Section Toggle */}
      <div className="mt-6 text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground" 
          onClick={handleToggleAdminSection}
        >
          <KeyIcon className="h-4 w-4 mr-1" /> 
          {showAdminSection ? "Hide Advanced Settings" : "Advanced Settings"}
        </Button>
      </div>
      
      {/* Secret Admin Section */}
      {showAdminSection && (
        <Card className={isAdmin ? "border-green-500 shadow-md" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5 text-primary" />
                    Administrator Access
                  </div>
                </CardTitle>
                <CardDescription>
                  Unlock administrator functions with the secret code
                </CardDescription>
              </div>
              
              {isAdmin && (
                <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Admin Active</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isAdmin ? (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">
                    Administrator access is enabled. You now have access to advanced features.
                  </p>
                </div>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <Switch id="debug-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced-tools">Advanced Tools</Label>
                    <Switch id="advanced-tools" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content-management">Content Management</Label>
                    <Switch id="content-management" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Enter the secret admin code to unlock administrator privileges. This is only for authorized personnel.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter admin code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAdminCodeSubmit}>
                    Validate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
