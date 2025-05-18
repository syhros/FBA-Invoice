import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderData, OrderItem } from '../../types/types';
import { loadOrderHistory, saveOrderToHistory } from '../../utils/localStorage';

interface OrderState {
  currentOrder: OrderData | null;
  orderHistory: OrderData[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: loadOrderHistory(),
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<OrderData | null>) => {
      state.currentOrder = action.payload;
      state.error = null;
    },
    updateCurrentOrder: (state, action: PayloadAction<Partial<OrderData>>) => {
      if (state.currentOrder) {
        state.currentOrder = { ...state.currentOrder, ...action.payload };
      }
    },
    updateCustomerDetails: (state, action: PayloadAction<Partial<OrderData['customer']>>) => {
      if (state.currentOrder) {
        state.currentOrder.customer = { ...state.currentOrder.customer, ...action.payload };
      }
    },
    updateShippingDetails: (state, action: PayloadAction<Partial<OrderData['shippingDetails']>>) => {
      if (state.currentOrder) {
        state.currentOrder.shippingDetails = { ...state.currentOrder.shippingDetails, ...action.payload };
      }
    },
    updateItemDetails: (state, action: PayloadAction<{ index: number; item: Partial<OrderItem> }>) => {
      const { index, item } = action.payload;
      if (state.currentOrder && state.currentOrder.items[index]) {
        state.currentOrder.items[index] = { ...state.currentOrder.items[index], ...item };
        
        // Recalculate totals
        state.currentOrder.items[index].total = 
          state.currentOrder.items[index].price * state.currentOrder.items[index].quantity;
        
        state.currentOrder.totals.subtotal = state.currentOrder.items.reduce(
          (sum, item) => sum + item.total, 0
        );
        
        // If VAT is set, recalculate
        if (state.currentOrder.totals.vat !== undefined) {
          const vatRate = state.currentOrder.totals.vat / state.currentOrder.totals.subtotal;
          state.currentOrder.totals.vat = parseFloat((state.currentOrder.totals.subtotal * vatRate).toFixed(2));
        }
        
        // Recalculate total
        state.currentOrder.totals.total = 
          state.currentOrder.totals.subtotal + 
          (state.currentOrder.totals.shipping || 0) + 
          (state.currentOrder.totals.vat || 0);
      }
    },
    setVatRate: (state, action: PayloadAction<number>) => {
      if (state.currentOrder) {
        const rate = action.payload / 100;
        state.currentOrder.totals.vat = parseFloat((state.currentOrder.totals.subtotal * rate).toFixed(2));
        
        // Recalculate total
        state.currentOrder.totals.total = 
          state.currentOrder.totals.subtotal + 
          (state.currentOrder.totals.shipping || 0) + 
          state.currentOrder.totals.vat;
      }
    },
    setShippingCost: (state, action: PayloadAction<number>) => {
      if (state.currentOrder) {
        state.currentOrder.totals.shipping = action.payload;
        
        // Recalculate total
        state.currentOrder.totals.total = 
          state.currentOrder.totals.subtotal + 
          action.payload + 
          (state.currentOrder.totals.vat || 0);
      }
    },
    saveOrderHistory: (state) => {
      if (state.currentOrder) {
        saveOrderToHistory(state.currentOrder);
        state.orderHistory = loadOrderHistory();
      }
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentOrder,
  updateCurrentOrder,
  updateCustomerDetails,
  updateShippingDetails,
  updateItemDetails,
  setVatRate,
  setShippingCost,
  saveOrderHistory,
  setOrderError,
  clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;