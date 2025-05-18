import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentOrder } from '../../store/slices/orderSlice';
import { History, Search, ChevronRight } from 'lucide-react';
import { OrderData } from '../../types/types';

const OrderHistoryPanel: React.FC = () => {
  const orderHistory = useSelector((state: RootState) => state.order.orderHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const filteredOrders = orderHistory.filter(order => 
    order.orderId.includes(searchTerm) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadOrder = (order: OrderData) => {
    dispatch(setCurrentOrder({...order}));
    setIsExpanded(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return 'Unknown date';
      return dateStr;
    } catch (error) {
      return dateStr;
    }
  };

  if (orderHistory.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed right-0 top-32 z-10 flex items-center bg-red-500 text-white p-2 rounded-l-md shadow-lg transition-transform duration-300 ${
          isExpanded ? 'transform translate-x-full' : ''
        }`}
        aria-label="Toggle order history"
      >
        <History className="h-5 w-5" />
        <span className="ml-2 whitespace-nowrap">Order History</span>
      </button>

      <div
        className={`fixed right-0 top-0 w-96 h-full bg-white shadow-xl z-20 transform transition-transform duration-300 ease-in-out ${
          isExpanded ? '' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <History className="text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Order History</h2>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                No matching orders found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <li key={order.orderId} className="py-3">
                    <button
                      onClick={() => handleLoadOrder(order)}
                      className="w-full text-left hover:bg-gray-100 p-2 rounded transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">#{order.orderId}</p>
                          <p className="text-sm text-gray-600">{order.customer.name}</p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-gray-600">{formatDate(order.purchaseDate)}</p>
                          <p className="font-medium">£{order.totals.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPanel;