import React from 'react';
import { FileText, ArrowDown } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-12 text-center">
      <FileText className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-2xl font-bold mb-4">Generate Amazon FBA Receipts</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Paste your Amazon order text in the parser above to get started.
        The application will automatically extract the order details and
        generate a professional PDF receipt.
      </p>
      <ArrowDown className="h-8 w-8 text-red-500 animate-bounce" />
    </div>
  );
};

export default EmptyState;