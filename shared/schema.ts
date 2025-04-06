import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  status: text("status").default("online"),
  uid: text("uid"), // Firebase UID
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  photoURL: true,
  status: true,
  uid: true,
});

// Message model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: integer("sender_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  senderId: true,
});

// Task (Homework) model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  completed: true,
  createdBy: true,
});

// Timetable entry model
export const timetableEntries = pgTable("timetable_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdBy: integer("created_by").notNull(),
});

export const insertTimetableEntrySchema = createInsertSchema(timetableEntries).pick({
  title: true,
  description: true,
  startTime: true,
  endTime: true,
  createdBy: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertTimetableEntry = z.infer<typeof insertTimetableEntrySchema>;
export type TimetableEntry = typeof timetableEntries.$inferSelect;

// Quiz model for Fun Learning
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(), // Science, Maths, SST, English
  description: text("description"),
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  title: true,
  subject: true,
  description: true,
  difficulty: true,
  createdBy: true,
});

// Quiz Question model
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of options
  correctOption: integer("correct_option").notNull(), // Index of correct option
  explanation: text("explanation"),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  question: true,
  options: true,
  correctOption: true,
  explanation: true,
});

// Flashcard model
export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  front: text("front").notNull(), // Question or term
  back: text("back").notNull(), // Answer or definition
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFlashcardSchema = createInsertSchema(flashcards).pick({
  subject: true,
  front: true,
  back: true,
  createdBy: true,
});

// Daily Fact model
export const dailyFacts = pgTable("daily_facts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  type: text("type").notNull(), // science_fact, math_trick, study_tip
  date: timestamp("date").defaultNow(),
  createdBy: integer("created_by"),
});

export const insertDailyFactSchema = createInsertSchema(dailyFacts).pick({
  content: true,
  type: true,
  createdBy: true,
});

// Learning Video model
export const learningVideos = pgTable("learning_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  youtubeId: text("youtube_id").notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  description: text("description"),
  addedBy: integer("added_by").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertLearningVideoSchema = createInsertSchema(learningVideos).pick({
  title: true,
  youtubeId: true,
  subject: true,
  topic: true,
  description: true,
  addedBy: true,
});

// Quiz Attempt model (for leaderboard and challenge features)
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  timeTaken: integer("time_taken"), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
  challengeId: integer("challenge_id"), // If part of a challenge
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  quizId: true,
  userId: true,
  score: true,
  maxScore: true,
  timeTaken: true,
  challengeId: true,
});

// Challenge model
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  challengerId: integer("challenger_id").notNull(),
  challengedId: integer("challenged_id").notNull(),
  status: text("status").default("pending"), // pending, accepted, completed
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  quizId: true,
  challengerId: true,
  challengedId: true,
  status: true,
  expiresAt: true,
});

// Fun Learning Types
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;

export type InsertDailyFact = z.infer<typeof insertDailyFactSchema>;
export type DailyFact = typeof dailyFacts.$inferSelect;

export type InsertLearningVideo = z.infer<typeof insertLearningVideoSchema>;
export type LearningVideo = typeof learningVideos.$inferSelect;

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// Homework help bot conversations
export const homeworkHelp = pgTable("homework_help", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHomeworkHelpSchema = createInsertSchema(homeworkHelp).pick({
  userId: true,
  title: true,
});

// Messages between user and AI in homework help
export const homeworkHelpMessages = pgTable("homework_help_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => homeworkHelp.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isFromAI: boolean("is_from_ai").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHomeworkHelpMessageSchema = createInsertSchema(homeworkHelpMessages).pick({
  conversationId: true,
  content: true,
  isFromAI: true,
});

export type InsertHomeworkHelp = z.infer<typeof insertHomeworkHelpSchema>;
export type HomeworkHelp = typeof homeworkHelp.$inferSelect;

export type InsertHomeworkHelpMessage = z.infer<typeof insertHomeworkHelpMessageSchema>;
export type HomeworkHelpMessage = typeof homeworkHelpMessages.$inferSelect;
