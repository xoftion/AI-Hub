import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Send, Bot, Brain, VolumeX } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AIRequest, AIResponse } from "@/types";

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: Bot, models: ['gpt-4o', 'gpt-3.5-turbo'] },
  { id: 'gemini', name: 'Gemini', icon: Bot, models: ['gemini-2.5-flash', 'gemini-2.5-pro'] },
  { id: 'deepseek', name: 'DeepSeek', icon: Brain, models: ['deepseek-chat', 'deepseek-coder'] },
  { id: 'elevenlabs', name: 'ElevenLabs', icon: VolumeX, models: ['eleven_monolingual_v1', 'eleven_multilingual_v2'] },
];

export default function ApiPlayground() {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [prompt, setPrompt] = useState('Write a creative story about AI helping humanity solve climate change...');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(500);
  const [topP, setTopP] = useState(1);
  const [response, setResponse] = useState<AIResponse | null>(null);

  const processRequestMutation = useMutation({
    mutationFn: (request: AIRequest) => apiClient.processAIRequest(request),
    onSuccess: (data: any) => {
      setResponse(data);
      toast({
        title: "Request Successful",
        description: `Processed in ${data.responseTime}ms`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = PROVIDERS.find(p => p.id === providerId);
    if (provider && provider.models.length > 0) {
      setSelectedModel(provider.models[0]);
    }
  };

  const handleSendRequest = () => {
    const request: AIRequest = {
      provider: selectedProvider,
      model: selectedModel,
      prompt,
      parameters: {
        temperature: temperature[0],
        maxTokens,
        topP,
      },
    };

    processRequestMutation.mutate(request);
  };

  const selectedProviderData = PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot size={20} />
          <span>API Playground</span>
        </CardTitle>
        <p className="text-sm text-gray-600">Test your AI providers with real-time requests</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Select AI Provider</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PROVIDERS.map((provider) => {
              const Icon = provider.icon;
              const isSelected = selectedProvider === provider.id;
              return (
                <Button
                  key={provider.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`flex items-center justify-center p-3 h-auto ${
                    isSelected ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <Icon size={16} className="mr-2" />
                  {provider.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <Label htmlFor="model-select">Model Selection</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {selectedProviderData?.models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Request Input */}
        <div>
          <Label htmlFor="prompt">Request Prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32 resize-none"
            placeholder="Enter your prompt here..."
          />
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Temperature: {temperature[0]}</Label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={2}
              min={0}
              step={0.1}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="top-p">Top P</Label>
            <Input
              id="top-p"
              type="number"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              step={0.1}
              min={0}
              max={1}
            />
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendRequest}
          disabled={processRequestMutation.isPending}
          className="w-full"
        >
          {processRequestMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send Request
            </>
          )}
        </Button>

        {/* Response Area */}
        {response && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Response</Label>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Response time: <strong>{response.responseTime}ms</strong></span>
                <span>•</span>
                <span>Tokens: <strong>{response.usage.totalTokens}</strong></span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-32">
              {selectedProvider === 'elevenlabs' ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Generated Audio:</span>
                  <audio controls src={response.content} className="flex-1">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {response.content}
                </pre>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
