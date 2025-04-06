import { ConversationList } from "@/components/conversations/conversation-list";
import { ConversationDetail } from "@/components/conversations/conversation-detail";
import { useAuth } from "@/hooks/use-auth";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function ConversationsPage() {
  const [, navigate] = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
      <h1 className="text-2xl font-bold mb-6">Conversations</h1>
      
      <div className="md:grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3 lg:col-span-1">
          <ConversationList />
        </div>
        
        {isDesktop && (
          <div className="hidden lg:block lg:col-span-2">
            <div className="h-[75vh] flex items-center justify-center text-center p-8 border rounded-lg bg-card">
              <div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list or start a new one
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}