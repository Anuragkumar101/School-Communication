import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, BellIcon, BellOffIcon } from "lucide-react";
import { requestNotificationPermission } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
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
    </div>
  );
};

export default SettingsPage;
