import { ConversationDetail } from "@/components/conversations/conversation-detail";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useParams, useLocation } from "wouter";

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="h-[80vh]">
        <ConversationDetail />
      </div>
    </div>
  );
}