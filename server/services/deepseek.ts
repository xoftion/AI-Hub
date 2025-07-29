import OpenAI from 'openai';
import { AIRequest, AIResponse } from '@shared/schema';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export class DeepSeekService {
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const response = await openai.chat.completions.create({
        model: request.model || 'deepseek-chat',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 1024,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        content: response.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        responseTime,
        model: request.model || 'deepseek-chat',
      };
    } catch (error: any) {
      throw new Error(`DeepSeek API Error: ${error.message}`);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      });
      return true;
    } catch {
      return false;
    }
  }
}