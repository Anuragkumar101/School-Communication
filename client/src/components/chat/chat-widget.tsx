import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import MessageBubble from "./message-bubble";
import { Send } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderPhotoURL?: string;
  timestamp: Date;
}

const ChatWidget = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = "global"; // Using a global chat for all users

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          senderPhotoURL: data.senderPhotoURL,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      
      setMessages(fetchedMessages.reverse());
      setLoading(false);
      
      // Scroll to bottom after messages load
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (values: MessageFormValues) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        content: values.content,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "Anonymous",
        senderPhotoURL: currentUser.photoURL,
        timestamp: serverTimestamp(),
        chatId: chatId,
      });

      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md h-[600px] overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-lg font-medium">Classroom Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Be the first one to say hello!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                sender={{
                  id: message.senderId,
                  name: message.senderName,
                  photoURL: message.senderPhotoURL,
                }}
                currentUser={currentUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Type your message..."
                      className="bg-gray-100 dark:bg-gray-800 border-0 rounded-full"
                      {...field}
                      disabled={!currentUser}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              className="ml-2 rounded-full"
              disabled={!currentUser || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Spinner size="sm" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChatWidget;
