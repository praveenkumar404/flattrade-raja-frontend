import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TradingWatchlistData {
  id: number;
  label: string, 
  value: any
}

interface SellerState {
  TradingWatchlistPersist: TradingWatchlistData;
}

const TradingWatchlist = localStorage.getItem('TradingWatchlist')

const initialState: SellerState = {
    TradingWatchlistPersist: TradingWatchlist
      ? JSON.parse(TradingWatchlist)
      : { id: 2, label: 'Banknifty', value: 26009 },
  };
  

const TradingWatchlistSlice = createSlice({
  name: 'TradingWatchlist',
  initialState,
  reducers: {
    setTradingWatchlistPersist(state, action: PayloadAction<TradingWatchlistData>) {
      state.TradingWatchlistPersist = action.payload;
      localStorage.setItem('TradingWatchlist', JSON.stringify(action?.payload));
    },
    resetTradingWatchlist(state) {
      state.TradingWatchlistPersist = { id: 2, label: 'Banknifty', value: 26009 };
      localStorage.removeItem('TradingWatchlist');
    },
  },
});

export const { setTradingWatchlistPersist, resetTradingWatchlist } = TradingWatchlistSlice.actions;

export default TradingWatchlistSlice.reducer;