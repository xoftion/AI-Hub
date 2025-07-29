import { AIRequest, AIResponse } from "@shared/schema";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function processDeepSeekRequest(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY_ENV_VAR || ""}`
      },
      body: JSON.stringify({
        model: request.model || "deepseek-chat",
        messages: [
          {
            role: "user",
            content: request.prompt
          }
        ],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 500,
        top_p: request.parameters?.topP || 1,
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;
    const content = data.choices?.[0]?.message?.content || "";
    const usage = data.usage;

    return {
      content,
      usage: {
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0,
        totalTokens: usage?.total_tokens || 0,
      },
      responseTime,
      model: request.model || "deepseek-chat",
    };
  } catch (error) {
    throw new Error(`DeepSeek API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function processDeepSeekCodeRequest(request: AIRequest): Promise<AIResponse> {
  const codeRequest = {
    ...request,
    model: "deepseek-coder",
    prompt: `${request.prompt}\n\nPlease provide a detailed code solution with explanations.`
  };
  
  return processDeepSeekRequest(codeRequest);
}

export async function checkDeepSeekHealth(): Promise<boolean> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY_ENV_VAR || ""}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5,
      })
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
