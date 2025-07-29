import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StatsGrid from "@/components/dashboard/stats-grid";
import ApiPlayground from "@/components/dashboard/api-playground";
import RecentActivity from "@/components/dashboard/recent-activity";
import ProviderStatusCard from "@/components/dashboard/provider-status";
import DeploymentStatus from "@/components/dashboard/deployment-status";
import IntegrationCards from "@/components/dashboard/integration-cards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, BarChart3, Download, Book } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi-Provider AI API Dashboard</h2>
          <p className="text-gray-600">Manage and monitor your AI integrations across OpenAI, Gemini, DeepSeek, and ElevenLabs</p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* API Playground */}
            <ApiPlayground />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Provider Status */}
            <ProviderStatusCard />

            {/* Deployment Status */}
            <DeploymentStatus />

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="default">
                    <Key size={16} className="mr-2" />
                    Manage API Keys
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 size={16} className="mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download size={16} className="mr-2" />
                    Export Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Book size={16} className="mr-2" />
                    API Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Cards */}
        <IntegrationCards />
      </div>

      <Footer />
    </div>
  );
}
