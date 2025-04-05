import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "firebase/auth";

interface UserAvatarProps {
  user: User | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ user, className, size = "md" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  // Get initials from display name
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {user?.photoURL ? (
        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
      ) : null}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(user?.displayName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
