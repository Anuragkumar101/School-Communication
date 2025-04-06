import { log } from "./vite";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * A service to handle interactions with the Google Gemini API
 */
export class GeminiService {
  private apiKey: string;
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";
  private model: string = "models/gemini-1.5-pro";

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }
    this.apiKey = apiKey;
  }

  /**
   * Generate a response from the Gemini API
   * @param prompt The user's question or prompt
   * @param systemPrompt Optional system instructions
   * @param userContext Optional user context/history
   * @returns The AI response text
   */
  async generateResponse(
    prompt: string,
    systemPrompt?: string,
    userContext?: { strengths?: string[], weaknesses?: string[], recentMistakes?: Array<{subject: string, topic: string, details: string}> }
  ): Promise<string> {
    try {
      // If we have user context, add it to the prompt
      let enhancedPrompt = prompt;
      
      if (userContext) {
        enhancedPrompt = this.addUserContextToPrompt(prompt, userContext);
      }
      
      const messages = [];
      
      // Add system instructions if provided
      if (systemPrompt) {
        messages.push({
          role: "system",
          parts: [{ text: systemPrompt }]
        });
      }
      
      // Add the user message
      messages.push({
        role: "user",
        parts: [{ text: enhancedPrompt }]
      });
      
      const requestBody = {
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        log(`Gemini API error: ${response.status} ${errorText}`);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json() as GeminiResponse;
      const textResponse = data.candidates[0]?.content?.parts[0]?.text || "";
      
      return textResponse;
    } catch (error: any) {
      log(`Error generating Gemini response: ${error.message}`);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  /**
   * Add user context to the prompt to make it more personalized
   */
  private addUserContextToPrompt(
    originalPrompt: string,
    userContext: { strengths?: string[], weaknesses?: string[], recentMistakes?: Array<{subject: string, topic: string, details: string}> }
  ): string {
    let contextInfo = "Based on your learning profile:\n";
    
    if (userContext.strengths && userContext.strengths.length > 0) {
      contextInfo += `- Your strengths are in: ${userContext.strengths.join(", ")}\n`;
    }
    
    if (userContext.weaknesses && userContext.weaknesses.length > 0) {
      contextInfo += `- Areas you're working to improve: ${userContext.weaknesses.join(", ")}\n`;
    }
    
    if (userContext.recentMistakes && userContext.recentMistakes.length > 0) {
      contextInfo += "- Based on your recent learning history, you sometimes struggle with:\n";
      userContext.recentMistakes.slice(0, 3).forEach(mistake => {
        contextInfo += `  * ${mistake.subject} (${mistake.topic}): ${mistake.details}\n`;
      });
    }
    
    return `${contextInfo}\n${originalPrompt}`;
  }
}

export const geminiService = new GeminiService();