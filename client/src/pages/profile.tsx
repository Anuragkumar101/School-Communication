import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import UserAvatar from "@/components/profile/user-avatar";
import Spinner from "@/components/ui/spinner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  photoURL: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
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
  );
};

export default ProfilePage;
