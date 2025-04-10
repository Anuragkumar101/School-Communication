import {
  users, type User, type InsertUser,
  conversations, type Conversation, type InsertConversation,
  conversationParticipants, type ConversationParticipant, type InsertConversationParticipant,
  messages, type Message, type InsertMessage,
  quizzes, type Quiz, type InsertQuiz,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  flashcards, type Flashcard, type InsertFlashcard,
  dailyFacts, type DailyFact, type InsertDailyFact,
  learningVideos, type LearningVideo, type InsertLearningVideo,
  quizAttempts, type QuizAttempt, type InsertQuizAttempt,
  challenges, type Challenge, type InsertChallenge,
  homeworkHelp, type HomeworkHelp, type InsertHomeworkHelp,
  homeworkHelpMessages, type HomeworkHelpMessage, type InsertHomeworkHelpMessage,
  userStreaks, type UserStreak, type InsertUserStreak,
  xpActivities, type XpActivity, type InsertXpActivity,
  userLearningProfiles, type UserLearningProfile, type InsertUserLearningProfile,
  aiInteractions, type AiInteraction, type InsertAiInteraction
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  
  // Quiz methods
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizzes(subject?: string): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Quiz Question methods
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  
  // Flashcard methods
  getFlashcards(subject?: string): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  
  // Daily Fact methods
  getDailyFact(date?: Date): Promise<DailyFact | undefined>;
  createDailyFact(fact: InsertDailyFact): Promise<DailyFact>;
  
  // Learning Video methods
  getLearningVideos(subject?: string, topic?: string): Promise<LearningVideo[]>;
  createLearningVideo(video: InsertLearningVideo): Promise<LearningVideo>;
  
  // Quiz Attempt methods
  getQuizAttempts(userId: number, quizId?: number): Promise<QuizAttempt[]>;
  getLeaderboard(timeFrame?: string): Promise<Array<{user: User, score: number, attempts: number}>>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  
  // Challenge methods
  getChallenges(userId: number, status?: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, data: Partial<Challenge>): Promise<Challenge>;
  
  // Homework Help methods
  getHomeworkHelpConversations(userId: number): Promise<HomeworkHelp[]>;
  getHomeworkHelpConversation(id: number): Promise<HomeworkHelp | undefined>;
  createHomeworkHelpConversation(conversation: InsertHomeworkHelp): Promise<HomeworkHelp>;
  
  // Homework Help Message methods
  getHomeworkHelpMessages(conversationId: number): Promise<HomeworkHelpMessage[]>;
  createHomeworkHelpMessage(message: InsertHomeworkHelpMessage): Promise<HomeworkHelpMessage>;
  
  // Streak and XP methods
  getUserStreak(userId: number): Promise<UserStreak | undefined>;
  createUserStreak(streak: InsertUserStreak): Promise<UserStreak>;
  updateUserStreak(userId: number, data: Partial<UserStreak>): Promise<UserStreak>;
  checkAndUpdateDailyStreak(userId: number): Promise<UserStreak>;
  
  // XP Activity methods
  getXpActivities(userId: number, limit?: number): Promise<XpActivity[]>;
  addXpActivity(activity: InsertXpActivity): Promise<XpActivity>;
  getUsersWithTopXp(limit?: number): Promise<Array<{user: User, totalXp: number, level: number}>>;
  
  // Conversation methods
  getConversations(userId: number): Promise<Conversation[]>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, data: Partial<Conversation>): Promise<Conversation>;
  
  // Conversation Participant methods
  getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]>;
  addParticipantToConversation(participant: InsertConversationParticipant): Promise<ConversationParticipant>;
  removeParticipantFromConversation(conversationId: number, userId: number): Promise<void>;
  
  // Message methods
  getMessages(conversationId: number, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number, userId: number): Promise<Message>;
  
  // Personalized AI methods
  getUserLearningProfile(userId: number): Promise<UserLearningProfile | undefined>;
  createUserLearningProfile(profile: InsertUserLearningProfile): Promise<UserLearningProfile>;
  updateUserLearningProfile(userId: number, data: Partial<UserLearningProfile>): Promise<UserLearningProfile>;
  recordAiInteraction(interaction: InsertAiInteraction): Promise<AiInteraction>;
  getUserAiInteractions(userId: number, limit?: number): Promise<AiInteraction[]>;
  updateUserMistake(userId: number, mistake: {subject: string, topic: string, details: string}): Promise<UserLearningProfile>;
}

// Import database and necessary operators from drizzle-orm
import { db } from './db';
import { eq, desc, or, sql, and, isNull } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // Homework Help methods
  async getHomeworkHelpConversations(userId: number): Promise<HomeworkHelp[]> {
    return db
      .select()
      .from(homeworkHelp)
      .where(eq(homeworkHelp.userId, userId))
      .orderBy(desc(homeworkHelp.updatedAt));
  }
  
  async getHomeworkHelpConversation(id: number): Promise<HomeworkHelp | undefined> {
    const [conversation] = await db
      .select()
      .from(homeworkHelp)
      .where(eq(homeworkHelp.id, id));
    return conversation;
  }
  
  async createHomeworkHelpConversation(conversation: InsertHomeworkHelp): Promise<HomeworkHelp> {
    const [newConversation] = await db
      .insert(homeworkHelp)
      .values(conversation)
      .returning();
    return newConversation;
  }
  
  // Homework Help Message methods
  async getHomeworkHelpMessages(conversationId: number): Promise<HomeworkHelpMessage[]> {
    return db
      .select()
      .from(homeworkHelpMessages)
      .where(eq(homeworkHelpMessages.conversationId, conversationId))
      .orderBy(homeworkHelpMessages.createdAt);
  }
  
  async createHomeworkHelpMessage(message: InsertHomeworkHelpMessage): Promise<HomeworkHelpMessage> {
    const [newMessage] = await db
      .insert(homeworkHelpMessages)
      .values(message)
      .returning();
    
    // Update the conversation's updatedAt timestamp
    await db
      .update(homeworkHelp)
      .set({ updatedAt: new Date() })
      .where(eq(homeworkHelp.id, message.conversationId));
    
    return newMessage;
  }
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.uid, uid as string));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }

  // Quiz methods
  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizzes(subject?: string): Promise<Quiz[]> {
    if (subject) {
      return db.select().from(quizzes).where(eq(quizzes.subject, subject));
    }
    return db.select().from(quizzes);
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  // Quiz Question methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [newQuestion] = await db.insert(quizQuestions).values(question).returning();
    return newQuestion;
  }

  // Flashcard methods
  async getFlashcards(subject?: string): Promise<Flashcard[]> {
    if (subject) {
      return db.select().from(flashcards).where(eq(flashcards.subject, subject));
    }
    return db.select().from(flashcards);
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [newFlashcard] = await db.insert(flashcards).values(flashcard).returning();
    return newFlashcard;
  }

  // Daily Fact methods
  async getDailyFact(date?: Date): Promise<DailyFact | undefined> {
    if (date) {
      // Convert date to ISO format for the specific day (YYYY-MM-DD)
      const dateString = date.toISOString().split('T')[0];
      const [fact] = await db
        .select()
        .from(dailyFacts)
        .where(sql`DATE(${dailyFacts.date}) = ${dateString}`);
      
      return fact;
    }
    
    // Get today's fact
    const today = new Date().toISOString().split('T')[0];
    const [todayFact] = await db
      .select()
      .from(dailyFacts)
      .where(sql`DATE(${dailyFacts.date}) = ${today}`);
    
    if (todayFact) return todayFact;
    
    // Get the most recent fact if no fact for today
    const [recentFact] = await db
      .select()
      .from(dailyFacts)
      .where(sql`${dailyFacts.date} IS NOT NULL`)
      .orderBy(desc(dailyFacts.date))
      .limit(1);
    
    return recentFact;
  }

  async createDailyFact(fact: InsertDailyFact): Promise<DailyFact> {
    const factWithDate = {
      ...fact,
      date: fact.date || new Date()
    };
    const [newFact] = await db.insert(dailyFacts).values(factWithDate).returning();
    return newFact;
  }

  // Learning Video methods
  async getLearningVideos(subject?: string, topic?: string): Promise<LearningVideo[]> {
    let query = db.select().from(learningVideos);
    
    if (subject) {
      query = query.where(eq(learningVideos.subject, subject));
    }
    
    if (topic) {
      query = query.where(eq(learningVideos.topic, topic));
    }
    
    return query;
  }

  async createLearningVideo(video: InsertLearningVideo): Promise<LearningVideo> {
    const videoWithDate = {
      ...video,
      addedAt: new Date()
    };
    const [newVideo] = await db.insert(learningVideos).values(videoWithDate).returning();
    return newVideo;
  }

  // Quiz Attempt methods
  async getQuizAttempts(userId: number, quizId?: number): Promise<QuizAttempt[]> {
    let query = db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId));
    
    if (quizId) {
      query = query.where(eq(quizAttempts.quizId, quizId));
    }
    
    return query.orderBy(desc(quizAttempts.completedAt));
  }

  async getLeaderboard(timeFrame?: string): Promise<Array<{user: User, score: number, attempts: number}>> {
    const now = new Date();
    let startDate: Date | null = null;
    
    if (timeFrame === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeFrame === 'monthly') {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
    }
    
    let query = db
      .select({
        userId: quizAttempts.userId,
        totalScore: sql<number>`SUM(${quizAttempts.score})`,
        attempts: sql<number>`COUNT(*)`
      })
      .from(quizAttempts);
    
    if (startDate) {
      query = query.where(sql`${quizAttempts.completedAt} >= ${startDate}`);
    }
    
    const attemptResults = await query
      .groupBy(quizAttempts.userId)
      .orderBy(sql`totalScore DESC`);
    
    const leaderboard: Array<{user: User, score: number, attempts: number}> = [];
    
    for (const result of attemptResults) {
      const user = await this.getUser(result.userId);
      if (user) {
        leaderboard.push({
          user,
          score: result.totalScore,
          attempts: result.attempts
        });
      }
    }
    
    return leaderboard;
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const attemptWithDate = {
      ...attempt,
      completedAt: new Date()
    };
    const [newAttempt] = await db.insert(quizAttempts).values(attemptWithDate).returning();
    return newAttempt;
  }

  // Challenge methods
  async getChallenges(userId: number, status?: string): Promise<Challenge[]> {
    let query = db
      .select()
      .from(challenges)
      .where(
        or(
          eq(challenges.challengerId, userId),
          eq(challenges.challengedId, userId)
        )
      );
    
    if (status) {
      query = query.where(eq(challenges.status, status));
    }
    
    return query.orderBy(desc(challenges.createdAt));
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const now = new Date();
    // Set default expiration (3 days from now)
    const expiresAt = challenge.expiresAt || new Date(now.setDate(now.getDate() + 3));
    
    const challengeWithDefaults = {
      ...challenge,
      status: challenge.status || 'pending',
      createdAt: new Date(),
      expiresAt
    };
    
    const [newChallenge] = await db
      .insert(challenges)
      .values(challengeWithDefaults)
      .returning();
    
    return newChallenge;
  }

  async updateChallenge(id: number, data: Partial<Challenge>): Promise<Challenge> {
    const [updatedChallenge] = await db
      .update(challenges)
      .set(data)
      .where(eq(challenges.id, id))
      .returning();
    
    if (!updatedChallenge) {
      throw new Error(`Challenge with ID ${id} not found`);
    }
    
    return updatedChallenge;
  }

  // User Streak methods
  async getUserStreak(userId: number): Promise<UserStreak | undefined> {
    const [streak] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId));
    
    return streak;
  }

  async createUserStreak(streak: InsertUserStreak): Promise<UserStreak> {
    const [newStreak] = await db
      .insert(userStreaks)
      .values(streak)
      .returning();
    
    return newStreak;
  }

  async updateUserStreak(userId: number, data: Partial<UserStreak>): Promise<UserStreak> {
    // First check if the streak exists
    const existingStreak = await this.getUserStreak(userId);
    
    if (!existingStreak) {
      // If no streak exists, create a new one with the provided data
      return this.createUserStreak({
        userId,
        currentStreak: data.currentStreak ?? 0,
        longestStreak: data.longestStreak ?? 0,
        lastActivity: data.lastActivity ?? new Date(),
        totalXp: data.totalXp ?? 0,
        level: data.level ?? 1
      });
    }
    
    // Otherwise update the existing streak
    const [updatedStreak] = await db
      .update(userStreaks)
      .set(data)
      .where(eq(userStreaks.userId, userId))
      .returning();
    
    return updatedStreak;
  }

  async checkAndUpdateDailyStreak(userId: number): Promise<UserStreak> {
    const userStreak = await this.getUserStreak(userId);
    
    if (!userStreak) {
      // If user doesn't have a streak yet, create one
      return this.createUserStreak({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivity: new Date(),
        totalXp: 0,
        level: 1
      });
    }
    
    const now = new Date();
    const lastActivity = new Date(userStreak.lastActivity);
    
    // Check if the last activity was yesterday (within 48 hours but not today)
    const isYesterday = (
      now.getTime() - lastActivity.getTime() < 48 * 60 * 60 * 1000 &&
      now.getDate() !== lastActivity.getDate()
    );
    
    // Check if the last activity was today
    const isToday = (
      now.getDate() === lastActivity.getDate() &&
      now.getMonth() === lastActivity.getMonth() &&
      now.getFullYear() === lastActivity.getFullYear()
    );
    
    if (isYesterday) {
      // Increment streak if last activity was yesterday
      const currentStreak = userStreak.currentStreak + 1;
      const longestStreak = Math.max(currentStreak, userStreak.longestStreak);
      
      return this.updateUserStreak(userId, {
        currentStreak,
        longestStreak,
        lastActivity: now
      });
    } else if (isToday) {
      // Just update the last activity time if already logged in today
      return this.updateUserStreak(userId, {
        lastActivity: now
      });
    } else {
      // Reset streak if more than a day has been missed
      return this.updateUserStreak(userId, {
        currentStreak: 1,
        lastActivity: now
      });
    }
  }

  // XP Activity methods
  async getXpActivities(userId: number, limit?: number): Promise<XpActivity[]> {
    const baseQuery = db
      .select()
      .from(xpActivities)
      .where(eq(xpActivities.userId, userId))
      .orderBy(desc(xpActivities.createdAt));
    
    if (limit) {
      return baseQuery.limit(limit);
    }
    
    return baseQuery;
  }

  async addXpActivity(activity: InsertXpActivity): Promise<XpActivity> {
    const [newActivity] = await db
      .insert(xpActivities)
      .values(activity)
      .returning();
    
    // Update user's total XP and level
    const userStreak = await this.getUserStreak(activity.userId);
    
    if (userStreak) {
      // Calculate new total XP
      const newTotalXp = userStreak.totalXp + activity.xpEarned;
      
      // Calculate new level (simple formula: level = 1 + floor(totalXp / 1000))
      const newLevel = 1 + Math.floor(newTotalXp / 1000);
      
      // Update user streak with new XP and level
      if (newLevel > userStreak.level) {
        // Level up!
        await this.updateUserStreak(activity.userId, {
          totalXp: newTotalXp,
          level: newLevel
        });
      } else {
        // Just update XP
        await this.updateUserStreak(activity.userId, {
          totalXp: newTotalXp
        });
      }
    } else {
      // If user doesn't have streak record, create one
      const level = 1 + Math.floor(activity.xpEarned / 1000);
      await this.createUserStreak({
        userId: activity.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivity: new Date(),
        totalXp: activity.xpEarned,
        level
      });
    }
    
    return newActivity;
  }

  async getUsersWithTopXp(limit: number = 10): Promise<Array<{user: User, totalXp: number, level: number}>> {
    const topUsers = await db
      .select()
      .from(userStreaks)
      .orderBy(desc(userStreaks.totalXp))
      .limit(limit);
    
    const result: Array<{user: User, totalXp: number, level: number}> = [];
    
    for (const streakRecord of topUsers) {
      const user = await this.getUser(streakRecord.userId);
      if (user) {
        result.push({
          user,
          totalXp: streakRecord.totalXp,
          level: streakRecord.level
        });
      }
    }
    
    return result;
  }

  // Conversation methods
  async getConversations(userId: number): Promise<Conversation[]> {
    // Get all conversations where the user is a participant
    const participations = await db
      .select({
        conversationId: conversationParticipants.conversationId
      })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));
    
    if (participations.length === 0) {
      return [];
    }
    
    // Get the conversation data
    const conversationIds = participations.map(p => p.conversationId);
    
    // Using SQL IN operator to get all conversations
    const results = await db
      .select()
      .from(conversations)
      .where(
        sql`${conversations.id} IN (${sql.join(conversationIds, sql`, `)})`
      )
      .orderBy(desc(conversations.updatedAt));
    
    return results;
  }
  
  async getConversationById(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    
    return conversation;
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    
    return newConversation;
  }
  
  async updateConversation(id: number, data: Partial<Conversation>): Promise<Conversation> {
    const [updatedConversation] = await db
      .update(conversations)
      .set(data)
      .where(eq(conversations.id, id))
      .returning();
    
    if (!updatedConversation) {
      throw new Error(`Conversation with ID ${id} not found`);
    }
    
    return updatedConversation;
  }
  
  // Conversation Participant methods
  async getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]> {
    return db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));
  }
  
  async addParticipantToConversation(participant: InsertConversationParticipant): Promise<ConversationParticipant> {
    const [newParticipant] = await db
      .insert(conversationParticipants)
      .values(participant)
      .returning();
    
    return newParticipant;
  }
  
  async removeParticipantFromConversation(conversationId: number, userId: number): Promise<void> {
    await db
      .delete(conversationParticipants)
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId)
        )
      );
  }
  
  // Message methods
  async getMessages(conversationId: number, limit?: number): Promise<Message[]> {
    const query = db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
    
    if (limit) {
      return query.limit(limit);
    }
    
    return query;
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({
        ...message,
        timestamp: new Date()
      })
      .returning();
    
    // Update conversation's updatedAt timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return newMessage;
  }
  
  async markMessageAsRead(messageId: number, userId: number): Promise<Message> {
    // Get the current message
    const [currentMessage] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));
    
    if (!currentMessage) {
      throw new Error(`Message with ID ${messageId} not found`);
    }
    
    // Add the userId to the readBy array if not already there
    const readBy: number[] = currentMessage.readBy as number[] || [];
    if (!readBy.includes(userId)) {
      readBy.push(userId);
    }
    
    // Update the message
    const [updatedMessage] = await db
      .update(messages)
      .set({ readBy })
      .where(eq(messages.id, messageId))
      .returning();
    
    return updatedMessage;
  }
  
  // Personalized AI methods
  async getUserLearningProfile(userId: number): Promise<UserLearningProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userLearningProfiles)
      .where(eq(userLearningProfiles.userId, userId));
    
    return profile;
  }
  
  async createUserLearningProfile(profile: InsertUserLearningProfile): Promise<UserLearningProfile> {
    const [newProfile] = await db
      .insert(userLearningProfiles)
      .values({
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newProfile;
  }
  
  async updateUserLearningProfile(userId: number, data: Partial<UserLearningProfile>): Promise<UserLearningProfile> {
    // Check if profile exists
    const existingProfile = await this.getUserLearningProfile(userId);
    
    if (!existingProfile) {
      // Create a new profile if none exists
      return this.createUserLearningProfile({
        userId,
        learningStyle: data.learningStyle,
        strengths: data.strengths as string[],
        weaknesses: data.weaknesses as string[],
        interests: data.interests as string[],
        recentMistakes: data.recentMistakes as Array<{subject: string, topic: string, details: string}>,
      });
    }
    
    // Update existing profile
    const [updatedProfile] = await db
      .update(userLearningProfiles)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(userLearningProfiles.userId, userId))
      .returning();
    
    return updatedProfile;
  }
  
  async recordAiInteraction(interaction: InsertAiInteraction): Promise<AiInteraction> {
    const [newInteraction] = await db
      .insert(aiInteractions)
      .values({
        ...interaction,
        createdAt: new Date()
      })
      .returning();
    
    return newInteraction;
  }
  
  async getUserAiInteractions(userId: number, limit?: number): Promise<AiInteraction[]> {
    const query = db
      .select()
      .from(aiInteractions)
      .where(eq(aiInteractions.userId, userId))
      .orderBy(desc(aiInteractions.createdAt));
    
    if (limit) {
      return query.limit(limit);
    }
    
    return query;
  }
  
  async updateUserMistake(userId: number, mistake: {subject: string, topic: string, details: string}): Promise<UserLearningProfile> {
    // Get the user's learning profile
    const profile = await this.getUserLearningProfile(userId);
    
    if (!profile) {
      // Create a new profile with this mistake
      return this.createUserLearningProfile({
        userId,
        recentMistakes: [mistake],
      });
    }
    
    // Add the new mistake to the existing profile's mistakes
    const recentMistakes = [...(profile.recentMistakes as any[] || [])];
    
    // Keep only the 10 most recent mistakes (including the new one)
    if (recentMistakes.length >= 10) {
      recentMistakes.shift(); // Remove the oldest mistake
    }
    
    recentMistakes.push(mistake); // Add the new mistake
    
    // Update the user's learning profile
    return this.updateUserLearningProfile(userId, {
      recentMistakes: recentMistakes as any,
    });
  }
}

export const storage = new DatabaseStorage();
