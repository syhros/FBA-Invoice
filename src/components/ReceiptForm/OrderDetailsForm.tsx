import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  updateCurrentOrder, 
  updateCustomerDetails,
  setVatRate,
  setShippingCost
} from '../../store/slices/orderSlice';
import { ShoppingCart, User, Truck, CreditCard, FileText } from 'lucide-react';

const OrderDetailsForm: React.FC = () => {
  const order = useSelector((state: RootState) => state.order.currentOrder);
  const dispatch = useDispatch();

  if (!order) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customer.')) {
      const field = name.split('.')[1];
      if (field === 'address') {
        dispatch(updateCustomerDetails({ 
          address: value.split('\n') 
        }));
      } else {
        dispatch(updateCustomerDetails({ [field]: value }));
      }
    } else {
      dispatch(updateCurrentOrder({ [name]: value }));
    }
  };

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vatRate = parseFloat(e.target.value) || 0;
    dispatch(setVatRate(vatRate));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shippingCost = parseFloat(e.target.value) || 0;
    dispatch(setShippingCost(shippingCost));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <ShoppingCart className="text-red-500 mr-2" />
        <h2 className="text-xl font-semibold">Order Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order ID
          </label>
          <input
            type="text"
            name="orderId"
            value={order.orderId}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt Number
          </label>
          <input
            type="text"
            name="receiptNumber"
            value={(order as any).receiptNumber || `REC-${order.orderId.slice(-15)}`}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <input
            type="text"
            name="purchaseDate"
            value={order.purchaseDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt Date
          </label>
          <input
            type="text"
            name="receiptDate"
            value={(order as any).receiptDate || new Date().toISOString().slice(0, 10)}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <User className="text-blue-500 mr-2 h-5 w-5" />
          <h3 className="text-md font-medium">Customer Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              name="customer.name"
              value={order.customer.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              name="customer.contact"
              value={order.customer.contact || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="customer.address"
              value={order.customer.address.join('\n')}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Truck className="text-blue-500 mr-2 h-5 w-5" />
          <h3 className="text-md font-medium">Shipping Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Service
            </label>
            <input
              type="text"
              name="shippingDetails.service"
              value={order.shippingDetails.service || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fulfillment
            </label>
            <input
              type="text"
              name="shippingDetails.fulfillment"
              value={order.shippingDetails.fulfillment || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sales Channel
            </label>
            <input
              type="text"
              name="shippingDetails.channel"
              value={order.shippingDetails.channel || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <CreditCard className="text-blue-500 mr-2 h-5 w-5" />
          <h3 className="text-md font-medium">Payment Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={(order as any).paymentMethod || 'Credit Card'}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VAT Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={order.totals.vat ? ((order.totals.vat / order.totals.subtotal) * 100).toFixed(1) : '20.0'}
              onChange={handleVatChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Cost (£)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={order.totals.shipping || '0.00'}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <FileText className="text-blue-500 mr-2 h-5 w-5" />
          <h3 className="text-md font-medium">Additional Notes</h3>
        </div>
        
        <textarea
          name="notes"
          value={(order as any).notes || ''}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Add any additional notes to be displayed on the receipt..."
        />
      </div>
    </div>
  );
};

export default OrderDetailsForm;