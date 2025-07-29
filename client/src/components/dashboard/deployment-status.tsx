import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Monitor, CheckCircle } from "lucide-react";
import { DeploymentInfo } from "@/types";

// Mock deployment data - in a real app this would come from your deployment platform APIs
const deployments: DeploymentInfo[] = [
  {
    service: "Backend API",
    platform: "Render.com",
    status: "live",
    lastDeployed: "2 hours ago"
  },
  {
    service: "Frontend",
    platform: "Vercel",
    status: "live",
    lastDeployed: "1 hour ago"
  }
];

const getStatusColor = (status: DeploymentInfo['status']) => {
  switch (status) {
    case 'live':
      return 'bg-green-100 text-green-800';
    case 'down':
      return 'bg-red-100 text-red-800';
    case 'deploying':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getServiceIcon = (service: string) => {
  return service.toLowerCase().includes('backend') ? Server : Monitor;
};

export default function DeploymentStatus() {
  const allHealthy = deployments.every(d => d.status === 'live');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {deployments.map((deployment) => {
          const Icon = getServiceIcon(deployment.service);
          const statusColor = getStatusColor(deployment.status);
          
          return (
            <div key={deployment.service} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  deployment.service.includes('Backend') ? 'bg-black' : 'bg-blue-100'
                }`}>
                  <Icon 
                    size={16} 
                    className={deployment.service.includes('Backend') ? 'text-white' : 'text-blue-600'} 
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{deployment.service}</p>
                  <p className="text-xs text-gray-600">{deployment.platform}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  deployment.status === 'live' ? 'bg-green-400' : 
                  deployment.status === 'down' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <Badge variant="secondary" className={statusColor}>
                  {deployment.status === 'live' ? 'Live' : 
                   deployment.status === 'down' ? 'Down' : 'Deploying'}
                </Badge>
              </div>
            </div>
          );
        })}

        {allHealthy && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={16} />
              <p className="text-sm text-green-800 font-medium">All deployments healthy</p>
            </div>
            <p className="text-xs text-green-700 mt-1">Last deployed 2 hours ago</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
