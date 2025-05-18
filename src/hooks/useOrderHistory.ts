import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { OrderData } from '../types/types';
import { saveOrderToHistory, loadOrderHistory } from '../utils/localStorage';
import { setCurrentOrder } from '../store/slices/orderSlice';

export const useOrderHistory = () => {
  const dispatch = useDispatch();
  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const orderHistory = useSelector((state: RootState) => state.order.orderHistory);

  // Load order from history by ID
  const loadOrder = (orderId: string) => {
    const order = orderHistory.find(o => o.orderId === orderId);
    if (order) {
      dispatch(setCurrentOrder({...order}));
      return true;
    }
    return false;
  };

  // Save current order to history
  const saveOrder = () => {
    if (currentOrder) {
      saveOrderToHistory(currentOrder);
      return true;
    }
    return false;
  };

  // Export order history to CSV
  const exportToCSV = () => {
    if (orderHistory.length === 0) return null;
    
    const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total'];
    const csvRows = [headers.join(',')];
    
    orderHistory.forEach(order => {
      const row = [
        `"${order.orderId}"`,
        `"${order.purchaseDate}"`,
        `"${order.customer.name}"`,
        `"${order.items.length}"`,
        `"£${order.totals.total.toFixed(2)}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'amazon-order-history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { loadOrder, saveOrder, exportToCSV, orderHistory };
};

export default useOrderHistory;