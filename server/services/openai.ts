import OpenAI from "openai";
import { AIRequest, AIResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

export class OpenAIService {
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const response = await openai.chat.completions.create({
        model: request.model || "gpt-4o",
        messages: [
          {
            role: "user",
            content: request.prompt
          }
        ],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 500,
        top_p: request.parameters?.topP || 1,
      });

      const responseTime = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || "";
      const usage = response.usage;

      return {
        content,
        usage: {
          promptTokens: usage?.prompt_tokens || 0,
          completionTokens: usage?.completion_tokens || 0,
          totalTokens: usage?.total_tokens || 0,
        },
        responseTime,
        model: request.model || "gpt-4o",
      };
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10,
      });
      return true;
    } catch {
      return false;
    }
  }
}