import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">AI API Hub</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Unified platform for managing multiple AI providers with seamless integration and deployment capabilities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">API Playground</a></li>
              <li><a href="#" className="hover:text-gray-900">Integrations</a></li>
              <li><a href="#" className="hover:text-gray-900">Analytics</a></li>
              <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Status Page</a></li>
              <li><a href="#" className="hover:text-gray-900">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© 2024 AI API Hub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
