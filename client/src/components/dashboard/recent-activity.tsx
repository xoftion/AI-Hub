import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Brain, VolumeX } from "lucide-react";
import { apiClient } from "@/lib/api";
import { ApiRequest } from "@/types";

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

const formatRequestType = (type: string) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatTimeAgo = (date: Date | string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export default function RecentActivity() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['/api/requests/recent'],
    queryFn: () => apiClient.getRecentRequests(10),
  }) as { data: ApiRequest[] | undefined, isLoading: boolean };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent API Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
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
        <CardTitle>Recent API Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests?.map((request) => {
            const Icon = getProviderIcon(request.provider);
            const providerColor = getProviderColor(request.provider);
            
            return (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${providerColor}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {request.provider} {request.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatRequestType(request.requestType)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    request.status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {request.status === 'success' ? 'Success' : 'Failed'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {request.createdAt ? formatTimeAgo(request.createdAt) : 'Unknown'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {!requests?.length && (
            <div className="text-center py-8 text-gray-500">
              No recent requests found
            </div>
          )}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-primary hover:text-blue-700">
          View All Requests
        </Button>
      </CardContent>
    </Card>
  );
}
