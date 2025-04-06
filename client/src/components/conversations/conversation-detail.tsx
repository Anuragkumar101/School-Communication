import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { 
  useConversation, 
  useConversationMessages, 
  useSendMessage,
  useMarkMessageAsRead
} from "@/hooks/use-conversations";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  ChevronLeft, 
  Send, 
  User as UserIcon,
  Info,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";
import { Message } from "@/lib/api/conversation";
import { cn } from "@/lib/utils";

export function ConversationDetail() {
  const { id } = useParams<{ id: string }>();
  const conversationId = id ? parseInt(id) : null;
  const { currentUser } = useAuth();
  const { data: conversation, isLoading: conversationLoading } = useConversation(conversationId);
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(conversationId);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendMessage();
  const markReadMutation = useMarkMessageAsRead();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (messages && currentUser) {
      messages.forEach(message => {
        // If message is not from current user and not marked as read by current user
        if (message.senderId !== currentUser.id && 
            (!message.readBy || !(message.readBy as any[]).includes(currentUser.id))) {
          markReadMutation.mutate({ messageId: message.id, userId: currentUser.id });
        }
      });
    }
  }, [messages, currentUser, markReadMutation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !currentUser || !conversationId) return;
    
    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: messageText,
        senderId: currentUser.id,
      });
      
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const isLoading = conversationLoading || messagesLoading;

  if (isLoading) {
    return <ConversationDetailSkeleton />;
  }

  if (!conversation) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/conversations">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <CardTitle className="ml-2">Conversation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <p className="text-muted-foreground">Conversation not found</p>
            <Button asChild className="mt-4">
              <Link href="/conversations">Back to Conversations</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/conversations">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <CardTitle className="ml-2">{conversation.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="ml-9">
          {conversation.participants.length} participants
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isCurrentUser={message.senderId === currentUser?.id}
                conversation={conversation}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <UserIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-end gap-2">
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[80px] flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageText.trim() || sendMessageMutation.isPending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  conversation: any;
}

function MessageBubble({ message, isCurrentUser, conversation }: MessageBubbleProps) {
  // Find sender in participants
  const sender = conversation.participants.find(
    (p: any) => p.userId === message.senderId
  )?.user;

  // Format timestamp
  const timestamp = message.timestamp 
    ? format(new Date(message.timestamp), 'h:mm a')
    : '';

  return (
    <div className={cn(
      "flex items-start gap-2",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 mt-1">
        {sender?.photoURL ? (
          <AvatarImage src={sender.photoURL} alt={sender.displayName || 'User'} />
        ) : (
          <AvatarFallback>
            {(sender?.displayName || 'U').charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn(
        "max-w-[75%] rounded-lg p-3",
        isCurrentUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <div className="flex justify-between gap-4">
          <span className="font-medium text-sm">
            {isCurrentUser ? 'You' : sender?.displayName || 'User'}
          </span>
          <span className="text-xs opacity-70">{timestamp}</span>
        </div>
        <p className="mt-1 break-words">{message.content}</p>
      </div>
    </div>
  );
}

function ConversationDetailSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" disabled>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-6 w-[150px] ml-2" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <Skeleton className="h-4 w-[100px] ml-9 mt-1" />
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn(
              "flex items-start gap-2",
              i % 2 === 0 ? "flex-row" : "flex-row-reverse"
            )}>
              <Skeleton className="h-8 w-8 rounded-full mt-1" />
              <div className={cn(
                "max-w-[75%] rounded-lg p-3",
                i % 2 === 0 ? "bg-muted" : "bg-primary"
              )}>
                <div className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-3 w-[40px]" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-[80%] mt-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t">
        <div className="flex w-full items-end gap-2">
          <Skeleton className="h-[80px] flex-grow rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}