import { apiRequest } from "@/lib/queryClient";

export interface AIResponse {
  response: string;
  withPersonalization: boolean;
}

export interface UserLearningProfile {
  id: number;
  userId: number;
  learningStyle: string | null;
  strengths: string[];
  weaknesses: string[];
  interests: string[];
  recentMistakes: Array<{
    subject: string;
    topic: string;
    details: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Ask the AI a question
export const askAI = async (
  userId: number,
  query: string,
  category?: string,
  subject?: string
): Promise<AIResponse> => {
  return apiRequest<AIResponse>("/api/ai/ask", {
    method: "POST",
    body: JSON.stringify({
      userId,
      query,
      category,
      subject,
    }),
  });
};

// Record a user mistake for improved personalization
export const recordMistake = async (
  userId: number,
  subject: string,
  topic: string,
  details: string
): Promise<{ success: boolean }> => {
  return apiRequest<{ success: boolean }>("/api/ai/record-mistake", {
    method: "POST",
    body: JSON.stringify({
      userId,
      subject,
      topic,
      details,
    }),
  });
};

// Get the user's learning profile
export const getLearningProfile = async (
  userId: number
): Promise<UserLearningProfile | null> => {
  try {
    return await apiRequest<UserLearningProfile>(`/api/ai/learning-profile/${userId}`);
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    throw error;
  }
};

// Create or update a learning profile
export const updateLearningProfile = async (
  userId: number,
  data: {
    learningStyle?: string;
    strengths?: string[];
    weaknesses?: string[];
    interests?: string[];
  }
): Promise<UserLearningProfile> => {
  return apiRequest<UserLearningProfile>("/api/ai/learning-profile", {
    method: "POST",
    body: JSON.stringify({
      userId,
      ...data,
    }),
  });
};

// Record feedback on an AI interaction
export const recordFeedback = async (
  userId: number,
  interactionId: number,
  helpfulnessRating: number
): Promise<{ success: boolean }> => {
  return apiRequest<{ success: boolean }>("/api/ai/feedback", {
    method: "POST",
    body: JSON.stringify({
      userId,
      interactionId,
      helpfulnessRating,
    }),
  });
};