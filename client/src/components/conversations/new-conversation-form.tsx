import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { createConversation, addParticipantToConversation } from "@/lib/api/conversation";
import { useAuth } from "@/hooks/use-auth";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  participants: z.array(z.string()),
  firstMessage: z.string().min(1, { message: "Message can't be empty" })
});

export function NewConversationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [availableUsers, setAvailableUsers] = useState<{value: string, label: string}[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      participants: [],
      firstMessage: ""
    },
  });

  // Fetch available users for participants
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const users = await response.json();
        
        // Transform users to the format expected by MultiSelect
        const usersOptions = users
          .filter((user: any) => user.id !== currentUser?.id)
          .map((user: any) => ({
            value: user.id.toString(),
            label: user.displayName || user.email || user.username
          }));
        
        setAvailableUsers(usersOptions);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to load available users",
          variant: "destructive"
        });
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a conversation",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Create the conversation
      const conversation = await createConversation({
        title: values.title,
        type: "group"
      });

      // 2. Add creator as admin participant
      await addParticipantToConversation({
        conversationId: conversation.id,
        userId: currentUser.id,
        isAdmin: true
      });

      // 3. Add selected participants
      for (const participantId of values.participants) {
        await addParticipantToConversation({
          conversationId: conversation.id,
          userId: parseInt(participantId),
          isAdmin: false
        });
      }

      // 4. Send first message
      await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: values.firstMessage,
          senderId: currentUser.id
        })
      });

      toast({
        title: "Success",
        description: "Conversation created successfully!"
      });

      // Navigate to the new conversation
      navigate(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Conversation</CardTitle>
        <CardDescription>Start a new conversation with your classmates or teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversation Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your conversation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select participants"
                      options={availableUsers}
                      selected={field.value.map(value => {
                        const option = availableUsers.find(opt => opt.value === value);
                        return option || { value, label: value };
                      })}
                      onChange={(selected) => {
                        field.onChange(selected.map(item => item.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your first message here" 
                      {...field} 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Conversation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}