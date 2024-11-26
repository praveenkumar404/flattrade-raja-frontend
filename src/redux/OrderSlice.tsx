import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: number;
  documentId: string;
  index: string;
  orderType: string;
  contractType: string;
  contractTsym: string;
  lotSize: number;
  norenordno: string | null;
  orderStatus: string | null;
  updatedAt: any
}

interface OrderState {
  orders: Order[];
  filters: {
    index?: string;
    orderType?: string;
    contractType?: string;
    contractTsym?: string;
    lotSize?: number;
    norenordno?: string | null;
    orderStatus?: string | null;
  };
}

const initialState: OrderState = {
  orders: [],
  filters: {},
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    updateFilters(state, action: PayloadAction<Partial<OrderState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = {};
    },
  },
});

export const { setOrders, updateFilters, resetFilters } = orderSlice.actions;

export default orderSlice.reducer;
