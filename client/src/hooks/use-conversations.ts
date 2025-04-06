import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserConversations,
  getConversationById,
  createConversation,
  addParticipantToConversation,
  removeParticipantFromConversation,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  ConversationWithParticipants,
  Message
} from "@/lib/api/conversation";

// Hook to get all conversations for the current user
export function useUserConversations() {
  return useQuery({
    queryKey: ['/api/conversations'],
    queryFn: () => getUserConversations(),
  });
}

// Hook to get a specific conversation by ID
export function useConversation(id: number | null) {
  return useQuery({
    queryKey: ['/api/conversations', id],
    queryFn: () => getConversationById(id!),
    enabled: !!id // Only fetch when id is available
  });
}

// Hook to create a new conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (conversation: { title: string; type: string }) =>
      createConversation(conversation),
    onSuccess: () => {
      // Invalidate the conversations list query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    }
  });
}

// Hook to add a participant to a conversation
export function useAddParticipant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (participant: { conversationId: number; userId: number; isAdmin: boolean }) =>
      addParticipantToConversation(participant),
    onSuccess: (_, variables) => {
      // Invalidate the specific conversation query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', variables.conversationId] });
    }
  });
}

// Hook to remove a participant from a conversation
export function useRemoveParticipant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: number; userId: number }) =>
      removeParticipantFromConversation(conversationId, userId),
    onSuccess: (_, variables) => {
      // Invalidate the specific conversation query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', variables.conversationId] });
    }
  });
}

// Hook to get messages for a conversation
export function useConversationMessages(conversationId: number | null, limit?: number) {
  return useQuery({
    queryKey: ['/api/messages', conversationId, { limit }],
    queryFn: () => getConversationMessages(conversationId!, limit),
    enabled: !!conversationId // Only fetch when conversationId is available
  });
}

// Hook to send a message to a conversation
export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (message: { conversationId: number; content: string; senderId: number }) =>
      sendMessage(message),
    onSuccess: (_, variables) => {
      // Invalidate the messages query for this conversation to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['/api/messages', variables.conversationId] });
    }
  });
}

// Hook to mark a message as read
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, userId }: { messageId: number; userId: number }) =>
      markMessageAsRead(messageId, userId),
    onSuccess: (updatedMessage) => {
      // Optimistically update the message in the cache
      queryClient.setQueryData(
        ['/api/messages', updatedMessage.conversationId],
        (oldData: Message[] | undefined) => {
          if (!oldData) return oldData;
          
          return oldData.map(message =>
            message.id === updatedMessage.id ? updatedMessage : message
          );
        }
      );
    }
  });
}