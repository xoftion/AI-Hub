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

export interface ApiRequest {
  id: string;
  provider: string;
  model: string;
  requestType: string;
  status: string;
  responseTime?: number;
  createdAt?: Date;
}

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

export interface DeploymentInfo {
  service: string;
  platform: string;
  status: 'live' | 'down' | 'deploying';
  lastDeployed?: string;
}
