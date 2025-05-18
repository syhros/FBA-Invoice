import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import PDFTemplate from './PDFTemplate';
import { Download, Eye, Save } from 'lucide-react';
import { saveOrderToHistory } from '../../utils/localStorage';
import { saveOrderHistory } from '../../store/slices/orderSlice';
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

const PDFPreview: React.FC = () => {
  const order = useSelector((state: RootState) => state.order.currentOrder);
  const company = useSelector((state: RootState) => state.company.details);
  const { templates, currentTemplateId } = useSelector((state: RootState) => state.template);
  const receiptRef = useRef<HTMLDivElement>(null);
  const receiptPrintRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const currentTemplate = templates.find(t => t.id === currentTemplateId) || templates[0];

  const handleSaveOrder = () => {
    if (order) {
      dispatch(saveOrderHistory());
    }
  };

  const handlePrint = useReactToPrint({
    content: () => receiptPrintRef.current,
  });

  if (!order || !company) return null;

  const receiptData = {
    ...order,
    company,
    paymentMethod: (order as any).paymentMethod || 'Credit Card',
    receiptNumber: (order as any).receiptNumber || `REC-${order.orderId.slice(-15)}`,
    receiptDate: (order as any).receiptDate || new Date().toISOString().slice(0, 10),
    notes: (order as any).notes || '',
    template: currentTemplate,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Eye className="text-red-500 mr-2" />
          <h2 className="text-xl font-semibold">Receipt Preview</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSaveOrder}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Receipt
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 overflow-auto">
        <div ref={receiptRef} style={{ width: '210mm', margin: '0 auto', transform: 'scale(0.7)', transformOrigin: 'top left' }}>
          <PDFTemplate data={receiptData} />
        </div>
      </div>

      <div style={{ display: 'none' }}>
        <div ref={receiptPrintRef} style={{ width: '210mm', margin: '0 auto' }}>
          <PDFTemplate data={receiptData} />
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;