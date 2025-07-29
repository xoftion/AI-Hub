import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, VolumeX } from "lucide-react";
import { apiClient } from "@/lib/api";
import { ProviderStatus } from "@/types";

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'openai':
      return Bot;
    case 'gemini':
      return Bot;
    case 'deepseek':
      return Brain;
    case 'elevenlabs':
      return VolumeX;
    default:
      return Bot;
  }
};

const getProviderColor = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'bg-blue-100 text-blue-600';
    case 'gemini':
      return 'bg-green-100 text-green-600';
    case 'deepseek':
      return 'bg-indigo-100 text-indigo-600';
    case 'elevenlabs':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getProviderDisplayName = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'OpenAI';
    case 'gemini':
      return 'Gemini';
    case 'deepseek':
      return 'DeepSeek';
    case 'elevenlabs':
      return 'ElevenLabs';
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1);
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-100 text-green-800';
    case 'offline':
      return 'bg-red-100 text-red-800';
    case 'error':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ProviderStatusCard() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['/api/providers/status'],
    queryFn: () => apiClient.getProviderStatuses(),
  }) as { data: ProviderStatus[] | undefined, isLoading: boolean };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Provider Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers?.map((provider) => {
          const Icon = getProviderIcon(provider.provider);
          const providerColor = getProviderColor(provider.provider);
          const statusColor = getStatusColor(provider.status);
          
          return (
            <div key={provider.provider} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${providerColor}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getProviderDisplayName(provider.provider)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {provider.models.slice(0, 2).join(', ')}
                    {provider.models.length > 2 && '...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  provider.status === 'online' ? 'bg-green-400' : 
                  provider.status === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <Badge variant="secondary" className={statusColor}>
                  {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                </Badge>
              </div>
            </div>
          );
        })}
        
        {!providers?.length && (
          <div className="text-center py-8 text-gray-500">
            No providers configured
          </div>
        )}
      </CardContent>
    </Card>
  );
}
