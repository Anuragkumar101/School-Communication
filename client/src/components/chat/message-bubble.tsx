import { cn } from "@/lib/utils";
import { format } from "date-fns";
import UserAvatar from "@/components/profile/user-avatar";
import { User } from "firebase/auth";

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    photoURL?: string;
  };
  currentUser: User | null;
}

const MessageBubble = ({ content, timestamp, sender, currentUser }: MessageBubbleProps) => {
  const isSentByCurrentUser = currentUser && sender.id === currentUser.uid;

  return (
    <div className={cn("flex items-start mb-4", isSentByCurrentUser ? "justify-end" : "")}>
      {!isSentByCurrentUser && (
        <div className="mr-3 flex-shrink-0">
          <UserAvatar 
            user={{ 
              displayName: sender.name, 
              photoURL: sender.photoURL 
            } as User} 
            size="sm" 
          />
        </div>
      )}

      <div className={cn("max-w-[75%]", isSentByCurrentUser ? "items-end" : "items-start")}>
        {!isSentByCurrentUser && (
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm mr-2">{sender.name}</span>
            <span className="text-xs text-gray-500">
              {format(timestamp, "p")}
            </span>
          </div>
        )}

        <div
          className={cn(
            "p-3 rounded-lg text-sm",
            isSentByCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-800 rounded-bl-sm"
          )}
        >
          {content}
        </div>

        {isSentByCurrentUser && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">
              {format(timestamp, "p")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
