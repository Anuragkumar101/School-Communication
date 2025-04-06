import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertQuizSchema, 
  insertQuizQuestionSchema,
  insertFlashcardSchema,
  insertDailyFactSchema,
  insertLearningVideoSchema,
  insertQuizAttemptSchema,
  insertChallengeSchema,
  insertXpActivitySchema,
  insertUserStreakSchema
} from "@shared/schema";

// XP Points constants
export const XP_ACTIONS = {
  DAILY_LOGIN: 10,
  COMPLETE_QUIZ: 50,
  PERFECT_QUIZ_SCORE: 100,
  HOMEWORK_HELP_QUESTION: 15,
  MAINTAIN_STREAK_WEEK: 70,
  COMPLETE_CHALLENGE: 75,
  WATCH_VIDEO: 20,
  USE_FLASHCARDS: 25
};

// Helper service for the Homework Help Bot
class HomeworkHelpService {
  static async generateAIResponse(prompt: string, userId: number): Promise<string> {
    // We'll replace this with actual AI API calls when we have the API key
    // For now, return a simple response based on the prompt
    
    // Basic responses to common prompts
    if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
      return "Hello! I'm your homework help assistant. How can I help you today?";
    }
    
    if (prompt.toLowerCase().includes('math') || prompt.toLowerCase().includes('equation')) {
      return "I can help with math problems! Could you provide the specific equation or problem you're working on?";
    }
    
    if (prompt.toLowerCase().includes('history')) {
      return "History is fascinating! What specific historical period or event are you studying?";
    }
    
    if (prompt.toLowerCase().includes('science') || prompt.toLowerCase().includes('biology') || prompt.toLowerCase().includes('chemistry') || prompt.toLowerCase().includes('physics')) {
      return "I'd be happy to help with your science questions. What specific concept are you having trouble with?";
    }
    
    if (prompt.toLowerCase().includes('help') || prompt.toLowerCase().includes('don\'t understand')) {
      return "I'm here to help! Please share the specific topic or question you're struggling with, and I'll do my best to explain it.";
    }
    
    if (prompt.toLowerCase().includes('thank')) {
      return "You're welcome! Feel free to ask if you have any other questions.";
    }
    
    // Generic response for other prompts
    return "I understand you're asking about '" + prompt + "'. To give you the best help, could you provide more specific details about what you're studying or the particular question you have?";
  }
}

// Helper service for Streaks and XP System
class StreakService {
  static async handleDailyLogin(userId: number): Promise<{
    streak: number, 
    longestStreak: number, 
    xpEarned: number, 
    level: number,
    levelUp: boolean
  }> {
    // Check and update the user's streak
    const updatedStreak = await storage.checkAndUpdateDailyStreak(userId);
    
    // Award XP for daily login
    const oldLevel = updatedStreak.level;
    const activity = await storage.addXpActivity({
      userId,
      activity: 'daily_login',
      description: 'Logged in today',
      xpEarned: XP_ACTIONS.DAILY_LOGIN
    });
    
    // Get the updated streak info after XP has been added
    const finalStreak = await storage.getUserStreak(userId);
    
    if (!finalStreak) {
      throw new Error('Failed to retrieve updated streak information');
    }
    
    // Check if user leveled up
    const levelUp = finalStreak.level > oldLevel;
    
    return {
      streak: finalStreak.currentStreak,
      longestStreak: finalStreak.longestStreak,
      xpEarned: XP_ACTIONS.DAILY_LOGIN,
      level: finalStreak.level,
      levelUp
    };
  }
  
  static async awardXpForAction(
    userId: number, 
    action: string, 
    description: string, 
    xpAmount: number
  ): Promise<{
    xpEarned: number,
    totalXp: number,
    level: number,
    levelUp: boolean
  }> {
    // Get current level
    const streakBefore = await storage.getUserStreak(userId);
    const oldLevel = streakBefore?.level || 0;
    
    // Add the XP activity
    await storage.addXpActivity({
      userId,
      activity: action,
      description,
      xpEarned: xpAmount
    });
    
    // Get updated streak/XP info
    const updatedStreak = await storage.getUserStreak(userId);
    
    if (!updatedStreak) {
      throw new Error('Failed to retrieve updated streak information');
    }
    
    // Check if level up occurred
    const levelUp = updatedStreak.level > oldLevel;
    
    return {
      xpEarned: xpAmount,
      totalXp: updatedStreak.totalXp,
      level: updatedStreak.level,
      levelUp
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User synchronization route
  app.post("/api/users/sync", async (req, res) => {
    try {
      const userData = {
        uid: req.body.uid,
        email: req.body.email,
        displayName: req.body.displayName,
        photoURL: req.body.photoURL
      };

      // Check if user exists by uid
      const existingUser = await storage.getUserByUid(userData.uid);
      
      if (existingUser) {
        // Update existing user
        const updatedUser = await storage.updateUser(existingUser.id, userData);
        res.json(updatedUser);
      } else {
        // Create new user
        const newUser = await storage.createUser({
          username: userData.email, // Use email as username
          password: "", // Password stored in Firebase
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          uid: userData.uid
        });
        res.json(newUser);
      }
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Failed to sync user data" });
    }
  });

  // Handle user registration directly on server (optional fallback)
  app.post("/api/users", async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
      
      const userData = userSchema.parse(req.body);
      
      // Remove confirmPassword before inserting
      const { confirmPassword, ...userToInsert } = userData;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userToInsert.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userToInsert);
      
      // Don't return the password in the response
      const { password, ...userResponse } = newUser;
      
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // ============ Fun Learning API Routes ============

  // === Quiz Routes ===
  // Get all quizzes or filter by subject
  app.get("/api/quizzes", async (req, res) => {
    try {
      const subject = req.query.subject as string | undefined;
      const quizzes = await storage.getQuizzes(subject);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });
  
  // Get a specific quiz
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      const questions = await storage.getQuizQuestions(quizId);
      
      res.json({ ...quiz, questions });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });
  
  // Create a new quiz
  app.post("/api/quizzes", async (req, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const newQuiz = await storage.createQuiz(quizData);
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });
  
  // Add questions to a quiz
  app.post("/api/quizzes/:id/questions", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      const questionData = insertQuizQuestionSchema.parse({
        ...req.body,
        quizId
      });
      
      const newQuestion = await storage.createQuizQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error adding question:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to add question" });
    }
  });
  
  // === Flashcard Routes ===
  // Get all flashcards or filter by subject
  app.get("/api/flashcards", async (req, res) => {
    try {
      const subject = req.query.subject as string | undefined;
      const flashcards = await storage.getFlashcards(subject);
      res.json(flashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });
  
  // Create a new flashcard
  app.post("/api/flashcards", async (req, res) => {
    try {
      const flashcardData = insertFlashcardSchema.parse(req.body);
      const newFlashcard = await storage.createFlashcard(flashcardData);
      res.status(201).json(newFlashcard);
    } catch (error) {
      console.error("Error creating flashcard:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create flashcard" });
    }
  });
  
  // === Daily Fact Routes ===
  // Get the daily fact
  app.get("/api/daily-fact", async (req, res) => {
    try {
      const dateParam = req.query.date as string | undefined;
      const date = dateParam ? new Date(dateParam) : undefined;
      const fact = await storage.getDailyFact(date);
      
      if (!fact) {
        return res.status(404).json({ message: "No daily fact found" });
      }
      
      res.json(fact);
    } catch (error) {
      console.error("Error fetching daily fact:", error);
      res.status(500).json({ message: "Failed to fetch daily fact" });
    }
  });
  
  // Create a new daily fact
  app.post("/api/daily-facts", async (req, res) => {
    try {
      const factData = insertDailyFactSchema.parse(req.body);
      const newFact = await storage.createDailyFact(factData);
      res.status(201).json(newFact);
    } catch (error) {
      console.error("Error creating daily fact:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create daily fact" });
    }
  });
  
  // === Learning Video Routes ===
  // Get all learning videos or filter by subject/topic
  app.get("/api/learning-videos", async (req, res) => {
    try {
      const subject = req.query.subject as string | undefined;
      const topic = req.query.topic as string | undefined;
      const videos = await storage.getLearningVideos(subject, topic);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching learning videos:", error);
      res.status(500).json({ message: "Failed to fetch learning videos" });
    }
  });
  
  // Add a new learning video
  app.post("/api/learning-videos", async (req, res) => {
    try {
      const videoData = insertLearningVideoSchema.parse(req.body);
      const newVideo = await storage.createLearningVideo(videoData);
      res.status(201).json(newVideo);
    } catch (error) {
      console.error("Error adding learning video:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to add learning video" });
    }
  });
  
  // === Quiz Attempt Routes ===
  // Submit a quiz attempt
  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const newAttempt = await storage.createQuizAttempt(attemptData);
      
      // Award XP based on quiz completion
      let xpAmount = XP_ACTIONS.COMPLETE_QUIZ;
      let description = `Completed a quiz and scored ${newAttempt.score}%`;
      
      // Award bonus XP for perfect scores
      if (newAttempt.score === 100) {
        xpAmount = XP_ACTIONS.PERFECT_QUIZ_SCORE;
        description = `Achieved a perfect score on a quiz!`;
      }
      
      // Award the XP
      const xpResult = await StreakService.awardXpForAction(
        newAttempt.userId,
        'quiz_completion',
        description,
        xpAmount
      );
      
      // Return both the attempt and XP info
      res.status(201).json({
        attempt: newAttempt,
        xp: xpResult
      });
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to submit quiz attempt" });
    }
  });
  
  // Get user's quiz attempts
  app.get("/api/users/:userId/quiz-attempts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const quizId = req.query.quizId ? parseInt(req.query.quizId as string) : undefined;
      const attempts = await storage.getQuizAttempts(userId, quizId);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      res.status(500).json({ message: "Failed to fetch quiz attempts" });
    }
  });
  
  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const timeFrame = req.query.timeFrame as string | undefined;
      const leaderboard = await storage.getLeaderboard(timeFrame);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  
  // === Challenge Routes ===
  // Create a new challenge
  app.post("/api/challenges", async (req, res) => {
    try {
      const challengeData = insertChallengeSchema.parse(req.body);
      const newChallenge = await storage.createChallenge(challengeData);
      res.status(201).json(newChallenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  
  // Get user's challenges
  app.get("/api/users/:userId/challenges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const status = req.query.status as string | undefined;
      const challenges = await storage.getChallenges(userId, status);
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  
  // Update challenge status
  app.patch("/api/challenges/:id", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'accepted', 'completed', 'declined'].includes(status)) {
        return res.status(400).json({ message: "Invalid challenge status" });
      }
      
      const updatedChallenge = await storage.updateChallenge(challengeId, { status });
      res.json(updatedChallenge);
    } catch (error) {
      console.error("Error updating challenge:", error);
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });

  // ============ Streaks & XP API Routes ============
  // Get user's streak and XP information
  app.get("/api/users/:userId/streak", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streak = await storage.getUserStreak(userId);
      
      if (!streak) {
        // If no streak exists, create a new one
        const newStreak = await storage.createUserStreak({
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivity: new Date(),
          totalXp: 0,
          level: 1
        });
        
        return res.json(newStreak);
      }
      
      res.json(streak);
    } catch (error) {
      console.error("Error fetching user streak:", error);
      res.status(500).json({ message: "Failed to fetch streak information" });
    }
  });
  
  // Record user login (check and update streak)
  app.post("/api/users/:userId/login", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streakInfo = await StreakService.handleDailyLogin(userId);
      res.json(streakInfo);
    } catch (error) {
      console.error("Error recording user login:", error);
      res.status(500).json({ message: "Failed to record login" });
    }
  });
  
  // Award XP to a user for completing actions
  app.post("/api/users/:userId/xp", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { action, description, xpAmount } = req.body;
      
      if (!action || !description || typeof xpAmount !== 'number') {
        return res.status(400).json({ message: "Action, description, and XP amount are required" });
      }
      
      const xpInfo = await StreakService.awardXpForAction(userId, action, description, xpAmount);
      res.json(xpInfo);
    } catch (error) {
      console.error("Error awarding XP:", error);
      res.status(500).json({ message: "Failed to award XP" });
    }
  });
  
  // Get user's XP activity history
  app.get("/api/users/:userId/xp-activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getXpActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching XP activities:", error);
      res.status(500).json({ message: "Failed to fetch XP activities" });
    }
  });
  
  // Get XP leaderboard
  app.get("/api/xp-leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const leaderboard = await storage.getUsersWithTopXp(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching XP leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch XP leaderboard" });
    }
  });

  // ============ Homework Help API Routes ============
  // Get user's homework help conversations
  app.get("/api/homework-help/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getHomeworkHelpConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching homework help conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  
  // Get a specific conversation
  app.get("/api/homework-help/conversation/:id", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const conversation = await storage.getHomeworkHelpConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getHomeworkHelpMessages(conversationId);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching homework help conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });
  
  // Create a new conversation
  app.post("/api/homework-help", async (req, res) => {
    try {
      const { userId, title } = req.body;
      
      if (!userId || !title) {
        return res.status(400).json({ message: "User ID and title are required" });
      }
      
      const conversation = await storage.createHomeworkHelpConversation({
        userId: parseInt(userId),
        title
      });
      
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating homework help conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });
  
  // Send a message to the homework help bot
  app.post("/api/homework-help/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { content, userId } = req.body;
      const parsedUserId = parseInt(userId);
      
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Create user message
      const userMessage = await storage.createHomeworkHelpMessage({
        conversationId,
        content,
        isFromAI: false
      });
      
      // Generate AI response
      const aiResponse = await HomeworkHelpService.generateAIResponse(content, parsedUserId);
      
      // Create AI message
      const aiMessage = await storage.createHomeworkHelpMessage({
        conversationId,
        content: aiResponse,
        isFromAI: true
      });
      
      // Award XP for using the homework help feature
      // We'll only award XP for substantial questions (longer than 20 characters)
      let xpResult = null;
      if (content.length > 20) {
        xpResult = await StreakService.awardXpForAction(
          parsedUserId,
          'homework_help',
          'Asked a question to the homework help bot',
          XP_ACTIONS.HOMEWORK_HELP_QUESTION
        );
      }
      
      res.json({
        userMessage,
        aiMessage,
        xp: xpResult
      });
    } catch (error) {
      console.error("Error sending message to homework help bot:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
