import { NewConversationForm } from "@/components/conversations/new-conversation-form";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function NewConversationPage() {
  const [, navigate] = useLocation();
  const { currentUser } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate("/conversations")}
          className="font-medium text-sm flex items-center text-muted-foreground hover:text-foreground"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-1"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to conversations
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <NewConversationForm />
      </div>
    </div>
  );
}