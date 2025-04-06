import { Conversation } from "@shared/schema";

export interface ConversationParticipant {
  id: number;
  conversationId: number;
  userId: number;
  joinedAt: Date | null;
  isAdmin: boolean | null;
  user?: any; // Will contain user details when loaded
}

export interface ConversationWithParticipants extends Conversation {
  participants: ConversationParticipant[];
}

// Get all conversations for the current user
export async function getUserConversations(): Promise<ConversationWithParticipants[]> {
  const response = await fetch('/api/conversations');
  const data = await response.json();
  return data;
}

// Get a specific conversation by ID
export async function getConversationById(id: number): Promise<ConversationWithParticipants> {
  const response = await fetch(`/api/conversations/${id}`);
  const data = await response.json();
  return data;
}

// Create a new conversation
export async function createConversation(conversation: {
  title: string;
  type: string;
}): Promise<ConversationWithParticipants> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(conversation),
  });
  
  const data = await response.json();
  return data;
}

// Add a participant to a conversation
export async function addParticipantToConversation(participant: {
  conversationId: number;
  userId: number;
  isAdmin: boolean;
}): Promise<ConversationParticipant> {
  const response = await fetch('/api/conversation-participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participant),
  });
  
  const data = await response.json();
  return data;
}

// Remove a participant from a conversation
export async function removeParticipantFromConversation(
  conversationId: number,
  userId: number
): Promise<void> {
  await fetch(`/api/conversation-participants/${conversationId}/${userId}`, {
    method: 'DELETE',
  });
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  senderId: number;
  timestamp: Date | null;
  readBy: unknown; // This might be an array of user IDs or similar
  messageType: string | null;
  attachmentUrl: string | null;
}

// Get messages for a conversation
export async function getConversationMessages(
  conversationId: number,
  limit?: number
): Promise<Message[]> {
  const url = limit
    ? `/api/conversations/${conversationId}/messages?limit=${limit}`
    : `/api/conversations/${conversationId}/messages`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Send a message to a conversation
export async function sendMessage(message: {
  conversationId: number;
  content: string;
  senderId: number;
}): Promise<Message> {
  const response = await fetch(`/api/conversations/${message.conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  
  const data = await response.json();
  return data;
}

// Mark a message as read
export async function markMessageAsRead(
  messageId: number,
  userId: number
): Promise<Message> {
  const response = await fetch(`/api/messages/${messageId}/read/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  
  const data = await response.json();
  return data;
}