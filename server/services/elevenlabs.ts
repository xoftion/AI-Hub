const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

export interface TextToSpeechRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
  responseTime: number;
}

export async function textToSpeechWithElevenLabs(request: TextToSpeechRequest): Promise<TextToSpeechResponse> {
  const startTime = Date.now();
  
  try {
    const voiceId = request.voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default voice
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY_ENV_VAR || ""
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.modelId || "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API returned ${response.status}: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const responseTime = Date.now() - startTime;
    
    // Convert audio buffer to base64 for transmission
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    return {
      audioUrl,
      responseTime,
    };
  } catch (error) {
    throw new Error(`ElevenLabs API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getElevenLabsVoices(): Promise<any[]> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY_ENV_VAR || ""
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    throw new Error(`ElevenLabs Voices API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function checkElevenLabsHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY_ENV_VAR || ""
      }
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
