import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TradingWatchlistData {
  id: number;
  label: string, 
  value: any
}

interface SellerState {
  TradingWatchlistPersist: TradingWatchlistData;
  marketMessagePersist: any;
}

const TradingWatchlist = localStorage.getItem('TradingWatchlist')
const marketMessage = localStorage.getItem('marketMessage')

const initialState: SellerState = {
    TradingWatchlistPersist: TradingWatchlist
      ? JSON.parse(TradingWatchlist)
      : { id: 2, label: 'Banknifty', value: 26009 },
      marketMessagePersist: marketMessage
      ? JSON.parse(marketMessage)
      :null
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

    setmarketMessagePersist(state, action: PayloadAction<any>) {
        state.TradingWatchlistPersist = action.payload;
        localStorage.setItem('marketMessage', JSON.stringify(action?.payload));
      },
    resetmarketMessagePersist(state) {
        state.TradingWatchlistPersist = { id: 2, label: 'Banknifty', value: 26009 };
        localStorage.removeItem('marketMessage');
      },
  },
});

export const { setTradingWatchlistPersist, resetTradingWatchlist, setmarketMessagePersist, resetmarketMessagePersist } = TradingWatchlistSlice.actions;

export default TradingWatchlistSlice.reducer;