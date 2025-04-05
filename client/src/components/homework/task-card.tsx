import { useState } from "react";
import { format, isAfter, isTomorrow, isToday } from "date-fns";
import { CheckIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { firestoreServices } from "@/hooks/use-firestore";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  createdBy: string;
  currentUserId: string;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  completed,
  createdBy,
  currentUserId,
}: TaskCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const isOwner = createdBy === currentUserId;
  
  const getDueDateStatus = () => {
    if (completed) return { text: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
    
    const now = new Date();
    if (isAfter(now, dueDate)) return { text: "Overdue", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
    if (isToday(dueDate)) return { text: "Due today", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" };
    if (isTomorrow(dueDate)) return { text: "Due tomorrow", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" };
    
    return { text: "Upcoming", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" };
  };

  const status = getDueDateStatus();

  const toggleCompleted = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await firestoreServices.updateDocument("tasks", id, {
        completed: !completed
      });
      
      toast({
        description: !completed 
          ? "Task marked as completed" 
          : "Task marked as not completed",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTask = async () => {
    if (isDeleting || !isOwner) return;
    
    try {
      setIsDeleting(true);
      await firestoreServices.deleteDocument("tasks", id);
      
      toast({
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className={cn(
        "border border-gray-200 dark:border-gray-800 rounded-lg p-4",
        completed && "opacity-70"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className={cn("font-medium", completed && "line-through")}>{title}</h4>
          {description && (
            <p className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", completed && "line-through")}>
              {description}
            </p>
          )}
        </div>
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", status.color)}>
          {status.text}
        </span>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-gray-500">
            Due: {format(dueDate, "MMM dd, yyyy")}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary dark:text-primary-foreground font-medium"
            disabled={isUpdating}
            onClick={toggleCompleted}
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            {completed ? "Undo" : "Complete"}
          </Button>
          
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 dark:text-red-400 font-medium"
              disabled={isDeleting}
              onClick={deleteTask}
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
