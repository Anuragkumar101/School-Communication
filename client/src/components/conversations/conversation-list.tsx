import { useState } from "react";
import { Link } from "wouter";
import { useUserConversations } from "@/hooks/use-conversations";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function ConversationList() {
  const { currentUser } = useAuth();
  const { data: conversations, isLoading, error } = useUserConversations();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter conversations based on search term
  const filteredConversations = conversations?.filter(convo => 
    convo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Conversations</h2>
          <Button asChild size="sm">
            <Link href="/conversations/new">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Link>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            disabled
          />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading conversations: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Conversations</h2>
        <Button asChild size="sm">
          <Link href="/conversations/new">
            <Plus className="mr-2 h-4 w-4" />
            New
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredConversations?.length === 0 && (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No conversations found</p>
            <Button asChild className="mt-4">
              <Link href="/conversations/new">Start a Conversation</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filteredConversations?.map(conversation => (
          <ConversationCard 
            key={conversation.id}
            conversation={conversation}
            currentUserId={currentUser?.id}
          />
        ))}
      </div>
    </div>
  );
}

interface ConversationCardProps {
  conversation: any; // Replace with proper type
  currentUserId: number | undefined;
}

function ConversationCard({ conversation, currentUserId }: ConversationCardProps) {
  // Get other participants (excluding current user)
  const otherParticipants = conversation.participants?.filter(
    (p: any) => p.userId !== currentUserId
  );
  
  // Format the timestamp
  const timeAgo = conversation.updatedAt
    ? formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })
    : conversation.createdAt
    ? formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })
    : '';

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
        <CardHeader className="p-4">
          <div className="flex justify-between">
            <CardTitle className="text-lg">{conversation.title}</CardTitle>
            <small className="text-muted-foreground">{timeAgo}</small>
          </div>
          
          <CardDescription>
            {conversation.lastMessage ? (
              <p className="truncate">
                {conversation.lastMessage.content}
              </p>
            ) : (
              <p className="text-muted-foreground">No messages yet</p>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex -space-x-2">
            {otherParticipants.slice(0, 3).map((participant: any) => (
              <Avatar key={participant.id} className="border-2 border-background h-8 w-8">
                {participant.photoURL ? (
                  <AvatarImage src={participant.photoURL} alt={participant.displayName || 'User'} />
                ) : (
                  <AvatarFallback>
                    {(participant.displayName || 'U').charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            ))}
            
            {otherParticipants.length > 3 && (
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarFallback>+{otherParticipants.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ConversationSkeleton() {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}