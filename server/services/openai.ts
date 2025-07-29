import OpenAI from "openai";
import { AIRequest, AIResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export async function processOpenAIRequest(request: AIRequest): Promise<AIResponse> {
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

export async function analyzeImageWithOpenAI(base64Image: string, prompt: string = "Analyze this image in detail"): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
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
      model: "gpt-4o",
    };
  } catch (error) {
    throw new Error(`OpenAI Vision API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateImageWithOpenAI(prompt: string): Promise<{ url: string; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const responseTime = Date.now() - startTime;
    return { 
      url: response.data?.[0]?.url || "", 
      responseTime 
    };
  } catch (error) {
    throw new Error(`OpenAI Image Generation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function checkOpenAIHealth(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    return !!response.choices[0]?.message?.content;
  } catch (error) {
    return false;
  }
}
