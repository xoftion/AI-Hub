import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { storage } from "./storage";
import { z } from "zod";
import { insertApiRequestSchema, AIRequest } from "@shared/schema";

// AI Service imports
import { processOpenAIRequest, analyzeImageWithOpenAI, generateImageWithOpenAI, checkOpenAIHealth } from "./services/openai";
import { processGeminiRequest, analyzeImageWithGemini, analyzeSentimentWithGemini, checkGeminiHealth } from "./services/gemini";
import { processDeepSeekRequest, processDeepSeekCodeRequest, checkDeepSeekHealth } from "./services/deepseek";
import { textToSpeechWithElevenLabs, getElevenLabsVoices, checkElevenLabsHealth } from "./services/elevenlabs";

const aiRequestSchema = z.object({
  provider: z.enum(["openai", "gemini", "deepseek", "elevenlabs"]),
  model: z.string(),
  prompt: z.string(),
  parameters: z.object({
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
    topP: z.number().optional(),
  }).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure CORS for cross-origin requests
  app.use('/api', cors({
    origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "*",
    credentials: true,
  }));

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      const providers = {
        openai: await checkOpenAIHealth(),
        gemini: await checkGeminiHealth(),
        deepseek: await checkDeepSeekHealth(),
        elevenlabs: await checkElevenLabsHealth(),
      };

      const allHealthy = Object.values(providers).every(status => status);
      
      res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'healthy' : 'degraded',
        providers,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get dashboard stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getApiStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get provider statuses
  app.get('/api/providers/status', async (req, res) => {
    try {
      const statuses = await storage.getProviderStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get provider statuses',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get recent API requests
  app.get('/api/requests/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const requests = await storage.getRecentApiRequests(limit);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get recent requests',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Process AI requests
  app.post('/api/ai/process', async (req, res) => {
    const startTime = Date.now();
    
    try {
      const validatedRequest = aiRequestSchema.parse(req.body);
      let response;
      let requestType = 'text_completion';

      // Route to appropriate AI service
      switch (validatedRequest.provider) {
        case 'openai':
          response = await processOpenAIRequest(validatedRequest);
          break;
        case 'gemini':
          response = await processGeminiRequest(validatedRequest);
          break;
        case 'deepseek':
          response = await processDeepSeekRequest(validatedRequest);
          requestType = validatedRequest.model.includes('coder') ? 'code_completion' : 'text_completion';
          break;
        case 'elevenlabs':
          const ttsResponse = await textToSpeechWithElevenLabs({ 
            text: validatedRequest.prompt,
            modelId: validatedRequest.model 
          });
          response = {
            content: ttsResponse.audioUrl,
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
            responseTime: ttsResponse.responseTime,
            model: validatedRequest.model,
          };
          requestType = 'text_to_speech';
          break;
        default:
          throw new Error(`Unsupported provider: ${validatedRequest.provider}`);
      }

      // Log the request
      await storage.createApiRequest({
        provider: validatedRequest.provider,
        model: validatedRequest.model,
        requestType,
        status: 'success',
        responseTime: response.responseTime,
        tokenCount: response.usage.totalTokens,
        metadata: {
          parameters: validatedRequest.parameters,
          promptLength: validatedRequest.prompt.length,
        },
      });

      res.json(response);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Log failed request
      if (req.body.provider) {
        await storage.createApiRequest({
          provider: req.body.provider,
          model: req.body.model || 'unknown',
          requestType: 'text_completion',
          status: 'error',
          responseTime,
          tokenCount: 0,
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }

      res.status(500).json({ 
        error: 'AI processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Image analysis endpoint
  app.post('/api/ai/analyze-image', async (req, res) => {
    const startTime = Date.now();
    
    try {
      const { provider, base64Image, prompt } = req.body;
      
      if (!provider || !base64Image) {
        return res.status(400).json({ error: 'Provider and base64Image are required' });
      }

      let response;
      
      switch (provider) {
        case 'openai':
          response = await analyzeImageWithOpenAI(base64Image, prompt);
          break;
        case 'gemini':
          response = await analyzeImageWithGemini(base64Image, prompt);
          break;
        default:
          throw new Error(`Image analysis not supported for provider: ${provider}`);
      }

      // Log the request
      await storage.createApiRequest({
        provider,
        model: response.model,
        requestType: 'image_analysis',
        status: 'success',
        responseTime: response.responseTime,
        tokenCount: response.usage.totalTokens,
        metadata: { prompt },
      });

      res.json(response);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (req.body.provider) {
        await storage.createApiRequest({
          provider: req.body.provider,
          model: 'vision',
          requestType: 'image_analysis',
          status: 'error',
          responseTime,
          tokenCount: 0,
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
      }

      res.status(500).json({ 
        error: 'Image analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get ElevenLabs voices
  app.get('/api/elevenlabs/voices', async (req, res) => {
    try {
      const voices = await getElevenLabsVoices();
      res.json(voices);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get voices',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update provider health status (internal endpoint)
  app.post('/api/providers/:provider/health', async (req, res) => {
    try {
      const { provider } = req.params;
      const { status } = req.body;
      
      await storage.updateProviderStatus(provider, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to update provider status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
