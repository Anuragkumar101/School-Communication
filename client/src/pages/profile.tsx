import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useStreaks } from "@/hooks/use-streaks";
import UserAvatar from "@/components/profile/user-avatar";
import Spinner from "@/components/ui/spinner";
import { StreakBadge } from "@/components/streaks/streak-badge";
import { XpLevel } from "@/components/streaks/xp-level";
import { XpActivityList } from "@/components/streaks/xp-activity-list";
import { Flame, Zap, Medal, Trophy, Award } from "lucide-react";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  photoURL: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { streak, activities, leaderboard, loading, recordLogin, fetchStreak, fetchActivities } = useStreaks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: currentUser?.displayName || "",
      photoURL: currentUser?.photoURL || "",
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (currentUser) {
      form.reset({
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
      });
    }
  }, [currentUser, form]);
  
  // Record login and check/update streak when the component mounts
  useEffect(() => {
    if (currentUser) {
      // Record the login and update the streak
      recordLogin();
    }
  }, [currentUser, recordLogin]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      await updateProfile(currentUser, {
        displayName: values.displayName,
        photoURL: values.photoURL || null,
      });
      
      toast({
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Please sign in to view your profile
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Stats Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <UserAvatar user={currentUser} size="lg" />
              <div>
                <CardTitle>{currentUser.displayName || "User"}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
              {streak ? (
                <>
                  <div className="flex flex-col items-center">
                    <StreakBadge 
                      streak={streak.currentStreak} 
                      longestStreak={streak.longestStreak}
                      size="lg"
                      showText
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <XpLevel 
                      level={streak.level} 
                      totalXp={streak.totalXp}
                      showProgress
                      size="lg"
                    />
                  </div>
                </>
              ) : loading.streak ? (
                <div className="py-6 w-full flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="py-6 w-full flex flex-col items-center">
                  <Flame className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">
                    Start using the app to build your streak and level up!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Edit Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="photoURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/your-image.jpg" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
                  Update Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* XP Activities Section */}
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activities" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span>Recent Activities</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">XP Activities</CardTitle>
              <CardDescription>
                Track your recent activities and earned XP
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.activities ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <XpActivityList 
                  activities={activities} 
                  className="max-h-[400px] overflow-y-auto pr-2"
                />
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => fetchActivities()}
                disabled={loading.activities}
              >
                Refresh Activities
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">XP Leaderboard</CardTitle>
              <CardDescription>
                See how you rank among other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.leaderboard ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.user.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.user.displayName === currentUser.displayName ? 'bg-primary/10' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.user.photoURL ? (
                            <img 
                              src={entry.user.photoURL} 
                              alt={entry.user.displayName} 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              {entry.user.displayName?.charAt(0) || '?'}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{entry.user.displayName}</p>
                            <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Zap className="h-4 w-4" />
                        {entry.totalXp} XP
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Award className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No leaderboard data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
