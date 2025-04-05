import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TrashIcon, EditIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { firestoreServices } from "@/hooks/use-firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TimetableEntryProps {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  createdBy: string;
  onEdit: (id: string) => void;
}

const TimetableEntry = ({
  id,
  title,
  description,
  startTime,
  endTime,
  createdBy,
  onEdit,
}: TimetableEntryProps) => {
  const { currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const isOwner = currentUser?.uid === createdBy;
  
  const startTimeStr = format(startTime, "h:mm a");
  const endTimeStr = format(endTime, "h:mm a");
  
  const deleteEntry = async () => {
    if (!isOwner || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await firestoreServices.deleteDocument("timetableEntries", id);
      
      toast({
        description: "Timetable entry deleted",
      });
    } catch (error) {
      console.error("Error deleting timetable entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete timetable entry",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {startTimeStr} - {endTimeStr}
          </div>
        </div>
        
        {isOwner && (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-primary"
              onClick={() => onEdit(id)}
            >
              <EditIcon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:text-red-500"
              onClick={deleteEntry}
              disabled={isDeleting}
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableEntry;
