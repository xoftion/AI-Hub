import { Brain, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI API Hub</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
              Production
            </Badge>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#dashboard" className="text-primary font-medium border-b-2 border-primary pb-4">
              Dashboard
            </a>
            <a href="#playground" className="text-gray-600 hover:text-gray-900 pb-4">
              API Playground
            </a>
            <a href="#integrations" className="text-gray-600 hover:text-gray-900 pb-4">
              Integrations
            </a>
            <a href="#settings" className="text-gray-600 hover:text-gray-900 pb-4">
              Settings
            </a>
            <a href="#docs" className="text-gray-600 hover:text-gray-900 pb-4">
              Documentation
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>All Services Online</span>
            </div>
            <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
              <User className="text-gray-600" size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
