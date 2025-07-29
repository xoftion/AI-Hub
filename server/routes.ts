import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { storage } from "./storage";
import { z } from "zod";
import { insertApiRequestSchema, AIRequest } from "@shared/schema";

// AI Service imports
import { OpenAIService } from "./services/openai";
import { GeminiService } from "./services/gemini";
import { DeepSeekService } from "./services/deepseek";
import { ElevenLabsService } from "./services/elevenlabs";
import { AnthropicService } from "./services/anthropic";
import { PerplexityService } from "./services/perplexity";

// Initialize service instances
const openaiService = new OpenAIService();
const geminiService = new GeminiService();
const deepseekService = new DeepSeekService();
const elevenlabsService = new ElevenLabsService();
const anthropicService = new AnthropicService();
const perplexityService = new PerplexityService();

const aiRequestSchema = z.object({
  provider: z.enum(["openai", "gemini", "deepseek", "elevenlabs", "anthropic", "perplexity"]),
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
        openai: await openaiService.checkHealth(),
        gemini: await geminiService.checkHealth(),
        deepseek: await deepseekService.checkHealth(),
        elevenlabs: await elevenlabsService.checkHealth(),
        anthropic: await anthropicService.checkHealth(),
        perplexity: await perplexityService.checkHealth(),
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

  // Get recent requests
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

  // Main AI processing endpoint
  app.post('/api/ai/process', async (req, res) => {
    try {
      const validatedRequest = aiRequestSchema.parse(req.body);
      const startTime = Date.now();
      
      let service;
      switch (validatedRequest.provider) {
        case 'openai':
          service = openaiService;
          break;
        case 'gemini':
          service = geminiService;
          break;
        case 'deepseek':
          service = deepseekService;
          break;
        case 'elevenlabs':
          service = elevenlabsService;
          break;
        case 'anthropic':
          service = anthropicService;
          break;
        case 'perplexity':
          service = perplexityService;
          break;
        default:
          return res.status(400).json({ error: 'Unsupported provider' });
      }

      // Check rate limiting (if user is authenticated)
      const userId = req.headers['x-user-id'] as string;
      if (userId) {
        const canProceed = await storage.checkRateLimit(userId, validatedRequest.provider);
        if (!canProceed) {
          return res.status(429).json({ 
            error: 'Rate limit exceeded',
            message: 'You have exceeded your rate limit. Please upgrade to premium for higher limits.'
          });
        }
      }

      const response = await service.processRequest(validatedRequest);
      
      // Log the request
      await storage.createApiRequest({
        userId: userId || null,
        provider: validatedRequest.provider as any,
        model: validatedRequest.model,
        prompt: validatedRequest.prompt,
        response: response.content,
        tokens: response.usage.totalTokens,
        cost: response.cost || '0',
        responseTime: response.responseTime,
        status: 'success',
        errorMessage: null,
      });

      // Update rate limiting
      if (userId) {
        await storage.incrementRateLimit(userId, validatedRequest.provider);
      }

      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log failed request
      try {
        const userId = req.headers['x-user-id'] as string;
        await storage.createApiRequest({
          userId: userId || null,
          provider: req.body.provider as any,
          model: req.body.model || 'unknown',
          prompt: req.body.prompt || '',
          response: null,
          tokens: 0,
          cost: '0',
          responseTime: Date.now() - (req as any).startTime || 0,
          status: 'error',
          errorMessage,
        });
      } catch (logError) {
        console.error('Failed to log error request:', logError);
      }

      res.status(500).json({ 
        error: 'AI processing failed',
        message: errorMessage
      });
    }
  });

  // User stats endpoint
  app.get('/api/user/stats', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get user stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Upgrade user to premium
  app.post('/api/user/upgrade', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const user = await storage.upgradeUser(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to upgrade user',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}