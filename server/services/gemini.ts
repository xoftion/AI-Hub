import { GoogleGenAI } from "@google/genai";
import { AIRequest, AIResponse } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export class GeminiService {
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const model = request.model || "gemini-2.5-flash";
      const response = await ai.models.generateContent({
        model,
        contents: request.prompt,
        config: {
          temperature: request.parameters?.temperature || 0.7,
          maxOutputTokens: request.parameters?.maxTokens || 500,
          topP: request.parameters?.topP || 1,
        },
      });

      const responseTime = Date.now() - startTime;
      const content = response.text || "";

      return {
        content,
        usage: {
          promptTokens: 0, // Gemini doesn't provide detailed token usage in the same format
          completionTokens: 0,
          totalTokens: content.split(' ').length, // Rough estimate
        },
        responseTime,
        model,
      };
    } catch (error) {
      throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello",
        config: {
          maxOutputTokens: 10,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}