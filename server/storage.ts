import {
  users, type User, type InsertUser,
  quizzes, type Quiz, type InsertQuiz,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  flashcards, type Flashcard, type InsertFlashcard,
  dailyFacts, type DailyFact, type InsertDailyFact,
  learningVideos, type LearningVideo, type InsertLearningVideo,
  quizAttempts, type QuizAttempt, type InsertQuizAttempt,
  challenges, type Challenge, type InsertChallenge
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
}

// Import database and necessary operators from drizzle-orm
import { db } from './db';
import { eq, desc, or, sql, and, isNull } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
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
}

export const storage = new DatabaseStorage();
