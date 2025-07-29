import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckCircle, Clock, Network } from "lucide-react";
import { apiClient } from "@/lib/api";
import { StatsData } from "@/types";

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => apiClient.getStats(),
  }) as { data: StatsData | undefined, isLoading: boolean };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total API Calls</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalCalls.toLocaleString() || "0"}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">
              +{stats?.trends.totalCallsChange || 0}%
            </span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.successRate.toFixed(1) || "0"}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">
              +{stats?.trends.successRateChange || 0}%
            </span>
            <span className="text-gray-600 ml-2">from last week</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.avgResponseTime || 0}ms
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-red-600 font-medium">
              +{stats?.trends.responseTimeChange || 0}ms
            </span>
            <span className="text-gray-600 ml-2">from yesterday</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Providers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeProviders || 0}/4
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Network className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">All Online</span>
            <span className="text-gray-600 ml-2">since 3 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
