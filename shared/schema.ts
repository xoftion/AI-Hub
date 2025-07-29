import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
  text,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const planTypeEnum = pgEnum('plan_type', ['free', 'premium']);
export const providerEnum = pgEnum('provider', ['openai', 'gemini', 'deepseek', 'elevenlabs', 'anthropic', 'perplexity']);
export const requestStatusEnum = pgEnum('request_status', ['success', 'error', 'pending']);

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  planType: planTypeEnum("plan_type").default('free'),
  requestsUsed: integer("requests_used").default(0),
  requestsLimit: integer("requests_limit").default(100), // Free tier limit
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Requests tracking
export const apiRequests = pgTable("api_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  provider: providerEnum("provider").notNull(),
  model: varchar("model").notNull(),
  prompt: text("prompt"),
  response: text("response"),
  tokens: integer("tokens").default(0),
  cost: decimal("cost", { precision: 10, scale: 4 }).default('0'),
  responseTime: integer("response_time"), // in milliseconds
  status: requestStatusEnum("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_api_requests_user_id").on(table.userId),
  index("idx_api_requests_provider").on(table.provider),
  index("idx_api_requests_created_at").on(table.createdAt),
]);

// Provider configurations
export const providerConfigs = pgTable("provider_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: providerEnum("provider").notNull().unique(),
  isEnabled: boolean("is_enabled").default(true),
  baseUrl: varchar("base_url"),
  rateLimitPerMinute: integer("rate_limit_per_minute").default(60),
  rateLimitPerHour: integer("rate_limit_per_hour").default(1000),
  costPerToken: decimal("cost_per_token", { precision: 10, scale: 6 }).default('0'),
  freeTierLimit: integer("free_tier_limit").default(10),
  premiumTierLimit: integer("premium_tier_limit").default(1000),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rate limiting tracking
export const rateLimits = pgTable("rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  provider: providerEnum("provider").notNull(),
  requestCount: integer("request_count").default(0),
  windowStart: timestamp("window_start").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_rate_limits_user_provider").on(table.userId, table.provider),
  index("idx_rate_limits_window").on(table.windowStart),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  apiRequests: many(apiRequests),
  rateLimits: many(rateLimits),
}));

export const apiRequestsRelations = relations(apiRequests, ({ one }) => ({
  user: one(users, {
    fields: [apiRequests.userId],
    references: [users.id],
  }),
}));

export const rateLimitsRelations = relations(rateLimits, ({ one }) => ({
  user: one(users, {
    fields: [rateLimits.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApiRequestSchema = createInsertSchema(apiRequests).omit({ id: true, createdAt: true });
export const insertProviderConfigSchema = createInsertSchema(providerConfigs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRateLimitSchema = createInsertSchema(rateLimits).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type ApiRequest = typeof apiRequests.$inferSelect;
export type InsertApiRequest = z.infer<typeof insertApiRequestSchema>;
export type ProviderConfig = typeof providerConfigs.$inferSelect;
export type InsertProviderConfig = z.infer<typeof insertProviderConfigSchema>;
export type RateLimit = typeof rateLimits.$inferSelect;
export type InsertRateLimit = z.infer<typeof insertRateLimitSchema>;

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
  cost?: number;
}

export interface StatsData {
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  activeProviders: number;
  totalCost: number;
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
  freeTierLimit: number;
  premiumTierLimit: number;
}

export interface UserStats {
  requestsUsed: number;
  requestsLimit: number;
  planType: 'free' | 'premium';
  subscriptionEndsAt?: Date;
  totalCost: number;
}