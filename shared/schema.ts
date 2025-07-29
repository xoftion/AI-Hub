import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const apiRequests = pgTable("api_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: text("provider").notNull(), // openai, gemini, deepseek, elevenlabs
  model: text("model").notNull(),
  requestType: text("request_type").notNull(), // text_completion, image_generation, etc.
  status: text("status").notNull(), // success, error
  responseTime: integer("response_time"), // milliseconds
  tokenCount: integer("token_count"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: jsonb("metadata"), // additional request/response data
});

export const providerConfigs = pgTable("provider_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: text("provider").notNull().unique(),
  isEnabled: text("is_enabled").notNull().default("true"),
  config: jsonb("config"), // provider-specific configuration
  lastHealthCheck: timestamp("last_health_check"),
  status: text("status").notNull().default("online"), // online, offline, error
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertApiRequestSchema = createInsertSchema(apiRequests).pick({
  provider: true,
  model: true,
  requestType: true,
  status: true,
  responseTime: true,
  tokenCount: true,
  metadata: true,
});

export const insertProviderConfigSchema = createInsertSchema(providerConfigs).pick({
  provider: true,
  isEnabled: true,
  config: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertApiRequest = z.infer<typeof insertApiRequestSchema>;
export type ApiRequest = typeof apiRequests.$inferSelect;

export type InsertProviderConfig = z.infer<typeof insertProviderConfigSchema>;
export type ProviderConfig = typeof providerConfigs.$inferSelect;

// API Request/Response types
export interface AIRequest {
  provider: string;
  model: string;
  prompt: string;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  responseTime: number;
  model: string;
}

export interface StatsData {
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  activeProviders: number;
  trends: {
    totalCallsChange: number;
    successRateChange: number;
    responseTimeChange: number;
  };
}

export interface ProviderStatus {
  provider: string;
  status: 'online' | 'offline' | 'error';
  models: string[];
  lastCheck: string;
}
