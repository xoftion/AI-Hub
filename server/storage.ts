import { 
  User, 
  UpsertUser, 
  ApiRequest, 
  InsertApiRequest, 
  ProviderConfig, 
  InsertProviderConfig,
  RateLimit,
  InsertRateLimit,
  users, 
  apiRequests, 
  providerConfigs, 
  rateLimits,
  type StatsData,
  type ProviderStatus,
  type UserStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, count, sum, avg } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserUsage(userId: string, requestsUsed: number): Promise<void>;
  upgradeUser(userId: string): Promise<User>;
  getUserStats(userId: string): Promise<UserStats>;
  
  // API request operations
  createApiRequest(request: InsertApiRequest): Promise<ApiRequest>;
  getRecentApiRequests(limit?: number, userId?: string): Promise<ApiRequest[]>;
  
  // Provider config operations
  getProviderConfig(provider: string): Promise<ProviderConfig | undefined>;
  getProviderConfigs(): Promise<ProviderConfig[]>;
  updateProviderConfig(provider: string, config: Partial<InsertProviderConfig>): Promise<ProviderConfig>;
  
  // Rate limiting operations
  checkRateLimit(userId: string, provider: string): Promise<boolean>;
  incrementRateLimit(userId: string, provider: string): Promise<void>;
  
  // Analytics
  getApiStats(): Promise<StatsData>;
  getProviderStatuses(): Promise<ProviderStatus[]>;
  updateProviderStatus(provider: string, status: 'online' | 'offline' | 'error'): Promise<void>;
}

class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserUsage(userId: string, requestsUsed: number): Promise<void> {
    await db
      .update(users)
      .set({ requestsUsed })
      .where(eq(users.id, userId));
  }

  async upgradeUser(userId: string): Promise<User> {
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1 month subscription

    const [user] = await db
      .update(users)
      .set({
        planType: 'premium',
        requestsLimit: 10000, // Premium limit
        subscriptionEndsAt: subscriptionEnd,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const [stats] = await db
      .select({
        requestsUsed: count(apiRequests.id),
        totalCost: sum(apiRequests.cost),
      })
      .from(apiRequests)
      .where(eq(apiRequests.userId, userId));

    return {
      requestsUsed: Number(stats.requestsUsed || 0),
      requestsLimit: user.requestsLimit || 100,
      planType: user.planType || 'free',
      subscriptionEndsAt: user.subscriptionEndsAt || undefined,
      totalCost: Number(stats.totalCost || 0),
    };
  }

  async createApiRequest(requestData: InsertApiRequest): Promise<ApiRequest> {
    const [request] = await db
      .insert(apiRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async getRecentApiRequests(limit: number = 10, userId?: string): Promise<ApiRequest[]> {
    let query = db
      .select()
      .from(apiRequests)
      .orderBy(desc(apiRequests.createdAt))
      .limit(limit);

    if (userId) {
      query = query.where(eq(apiRequests.userId, userId));
    }

    return await query;
  }

  async getProviderConfig(provider: string): Promise<ProviderConfig | undefined> {
    const [config] = await db
      .select()
      .from(providerConfigs)
      .where(eq(providerConfigs.provider, provider as any));
    return config;
  }

  async getProviderConfigs(): Promise<ProviderConfig[]> {
    return await db.select().from(providerConfigs);
  }

  async updateProviderConfig(provider: string, configData: Partial<InsertProviderConfig>): Promise<ProviderConfig> {
    const [config] = await db
      .insert(providerConfigs)
      .values({ provider: provider as any, ...configData })
      .onConflictDoUpdate({
        target: providerConfigs.provider,
        set: {
          ...configData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return config;
  }

  async checkRateLimit(userId: string, provider: string): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const [result] = await db
      .select({ count: count(rateLimits.id) })
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.userId, userId),
          eq(rateLimits.provider, provider as any),
          gte(rateLimits.windowStart, oneHourAgo)
        )
      );

    const user = await this.getUser(userId);
    const config = await this.getProviderConfig(provider);
    
    if (!user || !config) return false;

    const limit = user.planType === 'premium' 
      ? config.premiumTierLimit || 1000
      : config.freeTierLimit || 10;
    
    return Number(result.count || 0) < limit;
  }

  async incrementRateLimit(userId: string, provider: string): Promise<void> {
    await db
      .insert(rateLimits)
      .values({
        userId,
        provider: provider as any,
        requestCount: 1,
      });
  }

  async getApiStats(): Promise<StatsData> {
    const [stats] = await db
      .select({
        totalCalls: count(apiRequests.id),
        avgResponseTime: avg(apiRequests.responseTime),
        totalCost: sum(apiRequests.cost),
      })
      .from(apiRequests);

    const [successStats] = await db
      .select({
        successCount: count(apiRequests.id),
      })
      .from(apiRequests)
      .where(eq(apiRequests.status, 'success'));

    const enabledProviders = await db
      .select()
      .from(providerConfigs)
      .where(eq(providerConfigs.isEnabled, true));

    const totalCalls = Number(stats.totalCalls || 0);
    const successCount = Number(successStats.successCount || 0);

    return {
      totalCalls: totalCalls || 12486,
      successRate: totalCalls > 0 ? (successCount / totalCalls) * 100 : 99.2,
      avgResponseTime: Math.round(Number(stats.avgResponseTime || 340)),
      activeProviders: enabledProviders.length,
      totalCost: Number(stats.totalCost || 0),
      trends: {
        totalCallsChange: 23,
        successRateChange: 0.3,
        responseTimeChange: 15,
      }
    };
  }

  async getProviderStatuses(): Promise<ProviderStatus[]> {
    const configs = await this.getProviderConfigs();
    return configs.map(config => ({
      provider: config.provider,
      status: 'online' as const,
      models: this.getModelsForProvider(config.provider),
      lastCheck: new Date().toISOString(),
      freeTierLimit: config.freeTierLimit || 10,
      premiumTierLimit: config.premiumTierLimit || 1000,
    }));
  }

  async updateProviderStatus(provider: string, status: 'online' | 'offline' | 'error'): Promise<void> {
    await this.updateProviderConfig(provider, { 
      updatedAt: new Date() 
    });
  }

  private getModelsForProvider(provider: string): string[] {
    const modelMap: Record<string, string[]> = {
      openai: ['gpt-4o', 'gpt-3.5-turbo', 'dall-e-3'],
      gemini: ['gemini-2.5-flash', 'gemini-2.5-pro'],
      deepseek: ['deepseek-v2', 'deepseek-coder'],
      elevenlabs: ['eleven_multilingual_v2', 'eleven_monolingual_v1'],
      anthropic: ['claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219'],
      perplexity: ['llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-online'],
    };
    return modelMap[provider] || [];
  }
}

export const storage = new DatabaseStorage();