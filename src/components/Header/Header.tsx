import React from 'react';
import { FileText, Settings, ArrowUpRight } from 'lucide-react';
import companyLogo from '/src/assets/ashry-logo.svg';

interface HeaderProps {
  onToggleSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSettings }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src={companyLogo} alt="Ashry Ltd" className="h-10" />
            <div className="ml-4 flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">Amazon FBA Receipt Generator</h1>
              <span className="text-sm text-gray-500">Professional receipts for your FBA orders</span>
            </div>
          </div>
          
          <nav className="flex space-x-4">
            <a
              href="https://github.com/ashryltd/amazon-receipt-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FileText className="h-4 w-4 mr-1" />
              Documentation
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </a>
            
            <button
              onClick={onToggleSettings}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;