const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }

  // Stats
  async getStats(): Promise<any> {
    return this.request('/stats');
  }

  // Provider status
  async getProviderStatuses(): Promise<any> {
    return this.request('/providers/status');
  }

  // Recent requests
  async getRecentRequests(limit = 10): Promise<any> {
    return this.request(`/requests/recent?limit=${limit}`);
  }

  // AI processing
  async processAIRequest(request: any): Promise<any> {
    return this.request('/ai/process', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Image analysis
  async analyzeImage(provider: string, base64Image: string, prompt?: string) {
    return this.request('/ai/analyze-image', {
      method: 'POST',
      body: JSON.stringify({ provider, base64Image, prompt }),
    });
  }

  // ElevenLabs voices
  async getElevenLabsVoices() {
    return this.request('/elevenlabs/voices');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
