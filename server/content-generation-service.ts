import { log } from "./vite";
import { geminiService } from "./gemini-service";
import { insertQuizSchema, insertQuizQuestionSchema, insertFlashcardSchema, insertDailyFactSchema } from "@shared/schema";
import { storage } from "./storage";
import { z } from "zod";

/**
 * Service for generating educational content using Gemini AI
 */
export class ContentGenerationService {
  /**
   * Generate a new quiz with questions on a specific subject
   * @param subject The subject for the quiz (e.g., "Math", "Science", "History")
   * @param topic Optional specific topic within the subject
   * @param difficulty Optional difficulty level (easy, medium, hard)
   * @param questionCount Number of questions to generate (default: 5)
   * @returns The created quiz with questions
   */
  static async generateQuiz(
    subject: string,
    topic?: string,
    difficulty: "easy" | "medium" | "hard" = "medium",
    questionCount: number = 5
  ) {
    try {
      const topicText = topic ? ` about ${topic}` : "";
      const prompt = `Create a multiple-choice quiz on ${subject}${topicText} with ${questionCount} questions at ${difficulty} difficulty level.
      
Format the response as a valid JSON object with the following structure:
{
  "title": "Quiz title",
  "description": "Brief description of the quiz",
  "subject": "${subject}",
  "topic": "${topic || ""}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOption": 0,
      "explanation": "Explanation why the answer is correct"
    },
    ...more questions
  ]
}

Make sure the correctOption index (0-3) corresponds to the correct answer in the options array.
Ensure all questions are factually accurate, educational, and appropriate for students.`;

      const systemPrompt = "You are an expert educational content creator specializing in creating engaging quiz content for students. Provide accurate, grade-appropriate content in JSON format.";
      
      const jsonResponse = await geminiService.generateResponse(prompt, systemPrompt);
      
      try {
        // Parse the JSON response
        const quizData = JSON.parse(jsonResponse);
        
        // Validate the quiz structure
        if (!quizData.title || !quizData.description || !quizData.questions || !Array.isArray(quizData.questions)) {
          throw new Error("Invalid quiz data structure");
        }
        
        // Create the quiz
        const quiz = await storage.createQuiz({
          title: quizData.title,
          description: quizData.description,
          subject: subject,
          difficulty: difficulty,
          createdBy: 1 // Default to admin user (ID 1) for now
        });
        
        // Create the questions
        const questions = [];
        for (const q of quizData.questions) {
          if (!q.question || !Array.isArray(q.options) || q.correctOption === undefined || !q.explanation) {
            continue; // Skip invalid questions
          }
          
          const question = await storage.createQuizQuestion({
            quizId: quiz.id,
            question: q.question,
            options: q.options,
            correctOption: q.correctOption,
            explanation: q.explanation
          });
          
          questions.push(question);
        }
        
        return {
          ...quiz,
          questions
        };
      } catch (error) {
        log(`Error parsing quiz JSON: ${error}`);
        throw new Error("Failed to parse AI-generated quiz data");
      }
    } catch (error: any) {
      log(`Error generating quiz: ${error.message}`);
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }
  
  /**
   * Generate a set of flashcards on a specific subject
   * @param subject The subject for the flashcards
   * @param topic Optional specific topic within the subject
   * @param count Number of flashcards to generate (default: 10)
   * @returns Array of created flashcards
   */
  static async generateFlashcards(
    subject: string,
    topic?: string,
    count: number = 10
  ) {
    try {
      const topicText = topic ? ` about ${topic}` : "";
      const prompt = `Create a set of ${count} educational flashcards on ${subject}${topicText} for students.
      
Format the response as a valid JSON array with the following structure:
[
  {
    "front": "Question or term on the front of the flashcard",
    "back": "Answer or definition on the back of the flashcard",
    "subject": "${subject}",
    "topic": "${topic || ""}"
  },
  ...more flashcards
]

Ensure all content is factually accurate, educational, and appropriate for students.
Make the flashcards concise but informative.`;

      const systemPrompt = "You are an expert educational content creator specializing in creating effective flashcards for learning. Provide accurate, grade-appropriate content in JSON format.";
      
      const jsonResponse = await geminiService.generateResponse(prompt, systemPrompt);
      
      try {
        // Parse the JSON response
        const flashcardsData = JSON.parse(jsonResponse);
        
        // Validate the flashcards structure
        if (!Array.isArray(flashcardsData)) {
          throw new Error("Invalid flashcards data structure");
        }
        
        // Create the flashcards
        const flashcards = [];
        for (const fc of flashcardsData) {
          if (!fc.front || !fc.back) {
            continue; // Skip invalid flashcards
          }
          
          const flashcard = await storage.createFlashcard({
            front: fc.front,
            back: fc.back,
            subject: subject,
            createdBy: 1 // Default to admin user (ID 1) for now
          });
          
          flashcards.push(flashcard);
        }
        
        return flashcards;
      } catch (error) {
        log(`Error parsing flashcards JSON: ${error}`);
        throw new Error("Failed to parse AI-generated flashcards data");
      }
    } catch (error: any) {
      log(`Error generating flashcards: ${error.message}`);
      throw new Error(`Failed to generate flashcards: ${error.message}`);
    }
  }
  
  /**
   * Generate a daily fact
   * @param subject Optional subject focus for the fact
   * @returns The created daily fact
   */
  static async generateDailyFact(subject?: string) {
    try {
      const subjectText = subject ? ` about ${subject}` : " on any interesting educational subject";
      const prompt = `Create an interesting and educational daily fact${subjectText} for students.
      
Format the response as a valid JSON object with the following structure:
{
  "title": "Brief catchy title for the fact",
  "content": "The detailed fact content (2-3 sentences with an interesting educational fact)",
  "subject": "${subject || "General Knowledge"}"
}

Ensure the fact is factually accurate, educational, and interesting for students.`;

      const systemPrompt = "You are an expert educational content creator specializing in creating interesting educational facts for students. Provide accurate, engaging content in JSON format.";
      
      const jsonResponse = await geminiService.generateResponse(prompt, systemPrompt);
      
      try {
        // Parse the JSON response
        const factData = JSON.parse(jsonResponse);
        
        // Validate the fact structure
        if (!factData.title || !factData.content) {
          throw new Error("Invalid daily fact data structure");
        }
        
        // Create the daily fact
        const fact = await storage.createDailyFact({
          type: factData.subject || "General Knowledge",
          content: factData.content,
          createdBy: 1 // Default to admin user (ID 1) for now
        });
        
        return fact;
      } catch (error) {
        log(`Error parsing daily fact JSON: ${error}`);
        throw new Error("Failed to parse AI-generated daily fact data");
      }
    } catch (error: any) {
      log(`Error generating daily fact: ${error.message}`);
      throw new Error(`Failed to generate daily fact: ${error.message}`);
    }
  }
  
  /**
   * Generate learning video recommendations based on a subject and topic
   * @param subject The subject for video recommendations
   * @param topic Optional specific topic within the subject
   * @param count Number of video recommendations to generate (default: 5)
   * @returns Array of learning video recommendations (not saved to database)
   */
  static async generateVideoRecommendations(
    subject: string,
    topic?: string,
    count: number = 5
  ) {
    try {
      const topicText = topic ? ` about ${topic}` : "";
      const prompt = `Recommend ${count} educational videos on ${subject}${topicText} for students.
      
Format the response as a valid JSON array with the following structure:
[
  {
    "title": "Video title",
    "description": "Brief description of the video content",
    "url": "A plausible YouTube URL (use realistic video IDs)",
    "subject": "${subject}",
    "topic": "${topic || ""}",
    "duration": "MM:SS" (realistic video duration)
  },
  ...more videos
]

Do not provide actual links to existing videos, but create plausible titles and descriptions for educational videos that might exist.
Make recommendations appropriate for students learning about ${subject}${topicText}.`;

      const systemPrompt = "You are an expert educational content curator specializing in finding appropriate learning videos for students. Provide recommendations in JSON format.";
      
      const jsonResponse = await geminiService.generateResponse(prompt, systemPrompt);
      
      try {
        // Parse the JSON response
        const videosData = JSON.parse(jsonResponse);
        
        // Validate the videos structure
        if (!Array.isArray(videosData)) {
          throw new Error("Invalid video recommendations data structure");
        }
        
        // These are just recommendations, not saved to DB yet
        return videosData.filter(v => v.title && v.description && v.url);
      } catch (error) {
        log(`Error parsing video recommendations JSON: ${error}`);
        throw new Error("Failed to parse AI-generated video recommendations data");
      }
    } catch (error: any) {
      log(`Error generating video recommendations: ${error.message}`);
      throw new Error(`Failed to generate video recommendations: ${error.message}`);
    }
  }
}

export const contentGenerationService = new ContentGenerationService();