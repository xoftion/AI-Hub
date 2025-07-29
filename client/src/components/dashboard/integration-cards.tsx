import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, VolumeX } from "lucide-react";

const integrations = [
  {
    provider: "OpenAI",
    description: "Advanced language models for text generation, completion, and analysis.",
    icon: Bot,
    iconColor: "bg-blue-100 text-blue-600",
    models: "GPT Models",
    status: "Connected"
  },
  {
    provider: "Gemini",
    description: "Multi-modal AI capable of processing text, images, and more.",
    icon: Bot,
    iconColor: "bg-green-100 text-green-600",
    models: "Google AI",
    status: "Connected"
  },
  {
    provider: "DeepSeek",
    description: "Powerful language models optimized for coding and reasoning tasks.",
    icon: Brain,
    iconColor: "bg-indigo-100 text-indigo-600",
    models: "Advanced AI",
    status: "Connected"
  },
  {
    provider: "ElevenLabs",
    description: "High-quality text-to-speech and voice cloning technology.",
    icon: VolumeX,
    iconColor: "bg-purple-100 text-purple-600",
    models: "Voice AI",
    status: "Connected"
  }
];

export default function IntegrationCards() {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">AI Provider Integrations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          
          return (
            <Card key={integration.provider} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${integration.iconColor}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{integration.provider}</h4>
                    <p className="text-sm text-gray-600">{integration.models}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {integration.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
