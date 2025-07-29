import { AIRequest, AIResponse } from '@shared/schema';

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const voiceId = request.model || 'pNInz6obpgDQGcFmaJgB'; // Default voice
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: request.prompt,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Convert audio to base64 for response
      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');

      return {
        content: `Audio generated successfully. Length: ${audioBuffer.byteLength} bytes. Base64: data:audio/mpeg;base64,${audioBase64.substring(0, 100)}...`,
        usage: {
          promptTokens: request.prompt.length,
          completionTokens: Math.ceil(audioBuffer.byteLength / 1000), // Approximate
          totalTokens: request.prompt.length + Math.ceil(audioBuffer.byteLength / 1000),
        },
        responseTime,
        model: voiceId,
      };
    } catch (error: any) {
      throw new Error(`ElevenLabs API Error: ${error.message}`);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}