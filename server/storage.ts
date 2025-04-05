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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizzes: Map<number, Quiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private flashcards: Map<number, Flashcard>;
  private dailyFacts: Map<number, DailyFact>;
  private learningVideos: Map<number, LearningVideo>;
  private quizAttempts: Map<number, QuizAttempt>;
  private challenges: Map<number, Challenge>;
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.quizQuestions = new Map();
    this.flashcards = new Map();
    this.dailyFacts = new Map();
    this.learningVideos = new Map();
    this.quizAttempts = new Map();
    this.challenges = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.uid === uid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    // Initialize all optional fields with null to satisfy TypeScript
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      displayName: insertUser.displayName || null,
      photoURL: insertUser.photoURL || null,
      status: insertUser.status || null,
      uid: insertUser.uid || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.getUser(id);
    
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }

  // Quiz methods
  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async getQuizzes(subject?: string): Promise<Quiz[]> {
    const allQuizzes = Array.from(this.quizzes.values());
    if (subject) {
      return allQuizzes.filter(quiz => quiz.subject === subject);
    }
    return allQuizzes;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentId++;
    const now = new Date();
    const newQuiz: Quiz = {
      ...quiz,
      id,
      createdAt: now,
      description: quiz.description || null,
      difficulty: quiz.difficulty || null
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  // Quiz Question methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values())
      .filter(question => question.quizId === quizId);
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentId++;
    const newQuestion: QuizQuestion = {
      ...question,
      id,
      explanation: question.explanation || null
    };
    this.quizQuestions.set(id, newQuestion);
    return newQuestion;
  }

  // Flashcard methods
  async getFlashcards(subject?: string): Promise<Flashcard[]> {
    const allFlashcards = Array.from(this.flashcards.values());
    if (subject) {
      return allFlashcards.filter(card => card.subject === subject);
    }
    return allFlashcards;
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.currentId++;
    const now = new Date();
    const newFlashcard: Flashcard = {
      ...flashcard,
      id,
      createdAt: now
    };
    this.flashcards.set(id, newFlashcard);
    return newFlashcard;
  }

  // Daily Fact methods
  async getDailyFact(date?: Date): Promise<DailyFact | undefined> {
    const allFacts = Array.from(this.dailyFacts.values());
    if (date) {
      // Find a fact for the specific date (compare by day, month, year)
      const targetDate = new Date(date);
      return allFacts.find(fact => {
        if (!fact.date) return false;
        const factDate = new Date(fact.date);
        return (
          factDate.getDate() === targetDate.getDate() &&
          factDate.getMonth() === targetDate.getMonth() &&
          factDate.getFullYear() === targetDate.getFullYear()
        );
      });
    }
    // Return today's fact or the most recent one
    const now = new Date();
    const todayFact = allFacts.find(fact => {
      if (!fact.date) return false;
      const factDate = new Date(fact.date);
      return (
        factDate.getDate() === now.getDate() &&
        factDate.getMonth() === now.getMonth() &&
        factDate.getFullYear() === now.getFullYear()
      );
    });
    
    if (todayFact) return todayFact;
    
    // If no fact for today, return the most recent one
    return allFacts
      .filter(fact => fact.date !== null)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })[0];
  }

  async createDailyFact(fact: InsertDailyFact): Promise<DailyFact> {
    const id = this.currentId++;
    const now = new Date();
    const newFact: DailyFact = {
      ...fact,
      id,
      date: now,
      createdBy: fact.createdBy || null
    };
    this.dailyFacts.set(id, newFact);
    return newFact;
  }

  // Learning Video methods
  async getLearningVideos(subject?: string, topic?: string): Promise<LearningVideo[]> {
    let videos = Array.from(this.learningVideos.values());
    
    if (subject) {
      videos = videos.filter(video => video.subject === subject);
    }
    
    if (topic) {
      videos = videos.filter(video => video.topic === topic);
    }
    
    return videos;
  }

  async createLearningVideo(video: InsertLearningVideo): Promise<LearningVideo> {
    const id = this.currentId++;
    const now = new Date();
    const newVideo: LearningVideo = {
      ...video,
      id,
      addedAt: now,
      description: video.description || null
    };
    this.learningVideos.set(id, newVideo);
    return newVideo;
  }

  // Quiz Attempt methods
  async getQuizAttempts(userId: number, quizId?: number): Promise<QuizAttempt[]> {
    let attempts = Array.from(this.quizAttempts.values())
      .filter(attempt => attempt.userId === userId);
    
    if (quizId) {
      attempts = attempts.filter(attempt => attempt.quizId === quizId);
    }
    
    return attempts.sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getLeaderboard(timeFrame?: string): Promise<Array<{user: User, score: number, attempts: number}>> {
    const attempts = Array.from(this.quizAttempts.values());
    const now = new Date();
    let filteredAttempts = attempts;
    
    // Filter by time frame if specified
    if (timeFrame === 'weekly') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredAttempts = attempts.filter(attempt => {
        if (!attempt.completedAt) return false;
        return new Date(attempt.completedAt) >= weekAgo;
      });
    } else if (timeFrame === 'monthly') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredAttempts = attempts.filter(attempt => {
        if (!attempt.completedAt) return false;
        return new Date(attempt.completedAt) >= monthAgo;
      });
    }
    
    // Group attempts by user
    const userScores = new Map<number, {totalScore: number, attempts: number}>();
    
    for (const attempt of filteredAttempts) {
      const { userId, score } = attempt;
      const currentStats = userScores.get(userId) || { totalScore: 0, attempts: 0 };
      
      userScores.set(userId, {
        totalScore: currentStats.totalScore + score,
        attempts: currentStats.attempts + 1
      });
    }
    
    // Convert to array and include user details
    const leaderboard = Array.from(userScores.entries()).map(async ([userId, stats]) => {
      const user = await this.getUser(userId);
      if (!user) throw new Error(`User with ID ${userId} not found`);
      
      return {
        user,
        score: stats.totalScore,
        attempts: stats.attempts
      };
    });
    
    // Resolve all promises and sort by score
    return Promise.all(leaderboard).then(results => 
      results.sort((a, b) => b.score - a.score)
    );
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentId++;
    const now = new Date();
    const newAttempt: QuizAttempt = {
      ...attempt,
      id,
      completedAt: now,
      timeTaken: attempt.timeTaken || null,
      challengeId: attempt.challengeId || null
    };
    this.quizAttempts.set(id, newAttempt);
    return newAttempt;
  }

  // Challenge methods
  async getChallenges(userId: number, status?: string): Promise<Challenge[]> {
    let challenges = Array.from(this.challenges.values())
      .filter(challenge => 
        challenge.challengerId === userId || challenge.challengedId === userId
      );
    
    if (status) {
      challenges = challenges.filter(challenge => challenge.status === status);
    }
    
    return challenges.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentId++;
    const now = new Date();
    
    // Set default expiration (3 days from now)
    const expiresAt = challenge.expiresAt || new Date(now);
    if (!challenge.expiresAt) {
      expiresAt.setDate(expiresAt.getDate() + 3);
    }
    
    const newChallenge: Challenge = {
      ...challenge,
      id,
      status: challenge.status || 'pending',
      createdAt: now,
      expiresAt
    };
    
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async updateChallenge(id: number, data: Partial<Challenge>): Promise<Challenge> {
    const existingChallenge = this.challenges.get(id);
    
    if (!existingChallenge) {
      throw new Error(`Challenge with ID ${id} not found`);
    }
    
    const updatedChallenge = { ...existingChallenge, ...data };
    this.challenges.set(id, updatedChallenge);
    
    return updatedChallenge;
  }
}

export const storage = new MemStorage();
