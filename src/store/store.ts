import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import companyReducer from './slices/companySlice';
import templateReducer from './slices/templateSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
    company: companyReducer,
    template: templateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;