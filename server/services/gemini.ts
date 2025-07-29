import { GoogleGenAI } from "@google/genai";
import { AIRequest, AIResponse } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ENV_VAR || "" 
});

export async function processGeminiRequest(request: AIRequest): Promise<AIResponse> {
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

export async function analyzeImageWithGemini(base64Image: string, prompt: string = "Analyze this image in detail"): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const contents = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    const responseTime = Date.now() - startTime;
    const content = response.text || "";

    return {
      content,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: content.split(' ').length,
      },
      responseTime,
      model: "gemini-2.5-pro",
    };
  } catch (error) {
    throw new Error(`Gemini Vision API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeSentimentWithGemini(text: string): Promise<{ rating: number; confidence: number; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    const systemPrompt = `You are a sentiment analysis expert. 
Analyze the sentiment of the text and provide a rating
from 1 to 5 stars and a confidence score between 0 and 1.
Respond with JSON in this format: 
{'rating': number, 'confidence': number}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            rating: { type: "number" },
            confidence: { type: "number" },
          },
          required: ["rating", "confidence"],
        },
      },
      contents: text,
    });

    const responseTime = Date.now() - startTime;
    const rawJson = response.text;

    if (rawJson) {
      const data = JSON.parse(rawJson);
      return { ...data, responseTime };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error(`Gemini Sentiment Analysis Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function checkGeminiHealth(): Promise<boolean> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });
    return !!response.text;
  } catch (error) {
    return false;
  }
}
