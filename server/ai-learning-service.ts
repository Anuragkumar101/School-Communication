import { geminiService } from "./gemini-service";
import { storage } from "./storage";
import { log } from "./vite";
import { XP_ACTIONS } from "./routes";

/**
 * Service for handling personalized AI learning interactions
 */
export class AILearningService {
  /**
   * Generate a personalized response based on user's learning profile and history
   */
  static async getPersonalizedResponse(
    userId: number,
    query: string,
    category?: string, 
    subject?: string
  ): Promise<{ response: string, withPersonalization: boolean }> {
    try {
      // Get the user's learning profile
      const userProfile = await storage.getUserLearningProfile(userId);
      
      // Determine if we should use personalization
      const withPersonalization = !!userProfile;
      
      // Define the system prompt for the AI
      const systemPrompt = `You are an educational AI tutor designed to help students learn.
      Your responses should be:
      1. Accurate and educational
      2. Age-appropriate for secondary school students
      3. Encouraging and supportive
      4. Concise (limit to 3-4 paragraphs maximum)
      5. Include 1-2 follow-up questions to encourage continued learning
      
      If you don't know the answer to something, admit that instead of making up information.`;
      
      // Generate the AI response
      const response = await geminiService.generateResponse(
        query,
        systemPrompt,
        userProfile ? {
          strengths: userProfile.strengths as string[],
          weaknesses: userProfile.weaknesses as string[],
          recentMistakes: userProfile.recentMistakes as Array<{subject: string, topic: string, details: string}>
        } : undefined
      );
      
      // Record this interaction
      await storage.recordAiInteraction({
        userId,
        query,
        response,
        category: category || 'general_learning',
        relatedSubject: subject
      });
      
      // Award XP for using the AI learning feature
      await this.awardXpForAiInteraction(userId);
      
      return {
        response,
        withPersonalization
      };
    } catch (error: any) {
      log(`Error in AILearningService.getPersonalizedResponse: ${error.message}`);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }
  
  /**
   * Record a user mistake to improve personalization
   */
  static async recordUserMistake(
    userId: number,
    subject: string,
    topic: string,
    details: string
  ): Promise<void> {
    try {
      await storage.updateUserMistake(userId, {
        subject,
        topic,
        details
      });
    } catch (error: any) {
      log(`Error recording user mistake: ${error.message}`);
      throw new Error(`Failed to record user mistake: ${error.message}`);
    }
  }
  
  /**
   * Update a user's learning strengths and weaknesses
   */
  static async updateLearningProfile(
    userId: number,
    data: {
      learningStyle?: string,
      strengths?: string[],
      weaknesses?: string[],
      interests?: string[]
    }
  ): Promise<void> {
    try {
      await storage.updateUserLearningProfile(userId, data);
    } catch (error: any) {
      log(`Error updating learning profile: ${error.message}`);
      throw new Error(`Failed to update learning profile: ${error.message}`);
    }
  }
  
  /**
   * Record user feedback on an AI interaction
   */
  static async recordFeedback(
    userId: number,
    interactionId: number,
    helpfulnessRating: number
  ): Promise<void> {
    try {
      // TODO: Update the interaction with the rating
      // This requires adding a method to the storage interface
      log(`Recorded feedback for interaction ${interactionId}: ${helpfulnessRating}`);
    } catch (error: any) {
      log(`Error recording feedback: ${error.message}`);
      throw new Error(`Failed to record feedback: ${error.message}`);
    }
  }
  
  /**
   * Award XP for using the AI learning feature
   */
  private static async awardXpForAiInteraction(userId: number): Promise<void> {
    try {
      // Get the user's interaction count for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const recentInteractions = await storage.getUserAiInteractions(userId);
      const todayInteractions = recentInteractions.filter(interaction => {
        const interactionDate = new Date(interaction.createdAt);
        interactionDate.setHours(0, 0, 0, 0);
        return interactionDate.getTime() === today.getTime();
      });
      
      // Only award XP for the first 5 interactions per day
      if (todayInteractions.length <= 5) {
        await storage.addXpActivity({
          userId,
          activity: "use_ai_tutor",
          description: "Used the AI learning assistant",
          xpEarned: XP_ACTIONS.USE_AI_TUTOR
        });
      }
    } catch (error: any) {
      log(`Error awarding XP for AI interaction: ${error.message}`);
      // Don't throw here - this is not critical to the main functionality
    }
  }
}