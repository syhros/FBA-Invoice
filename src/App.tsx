import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import TextParserComponent from './components/TextParser/TextParserComponent';
import ReceiptForm from './components/ReceiptForm/ReceiptForm';
import PDFPreview from './components/PDFGenerator/PDFPreview';
import OrderHistoryPanel from './components/OrderHistory/OrderHistoryPanel';
import Header from './components/Header/Header';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import EmptyState from './components/EmptyState/EmptyState';
import SettingsPanel from './components/Settings/SettingsPanel';

function App() {
  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)} />
      
      <main className="flex-grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay />
          
          <div className="space-y-6">
            <TextParserComponent />
            
            {currentOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ReceiptForm />
                </div>
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <PDFPreview />
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
      
      <OrderHistoryPanel />
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

export default App;