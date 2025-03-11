import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPosition } from '../api/Service/CommanServiceapi';

interface PositionData {
  id: number;
  index: string;
  indexToken: string;
  contractType: string | null | number;
  contractToken: string | null | number;
  tsym: string | null | number;
  lotSize: string | null | number;
  quantity: any;
  updatedAt: any;
}

interface SellerState {
  positionsPersist: PositionData[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SellerState = {
  positionsPersist: [],
  loading: false,
  error: null,
};

// Async thunk for fetching positions
export const fetchPositionsThunk = createAsyncThunk(
  'seller/fetchPositions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPosition();
      return response.data.filter(
        (item: any) => item.contractType && item.contractToken && item.tsym && item.lotSize
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Seller slice
const SellerSlice = createSlice({
  name: 'Seller',
  initialState,
  reducers: {
    setPositionsPersist(state, action: PayloadAction<PositionData[]>) {
      state.positionsPersist = action.payload;
    },
    resetPositions(state) {
      state.positionsPersist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositionsThunk.fulfilled, (state, action) => {
        state.positionsPersist = action.payload;
        state.loading = false;
      })
      .addCase(fetchPositionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPositionsPersist, resetPositions } = SellerSlice.actions;
export default SellerSlice.reducer;













// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface PositionData {
//   id: number;
//   index: string;
//   indexToken: string;
//   contractType: string | null | number;
//   contractToken: string | null | number;
//   tsym: string | null | number;
//   lotSize: string | null | number;
//   quantity: any;
//   updatedAt: any;
// }

// interface SellerState {
//   positionsPersist: PositionData[];
// }

// const initialState: SellerState = {
//   positionsPersist: [],
// };

// const SellerSlice = createSlice({
//   name: 'Seller',
//   initialState,
//   reducers: {
//     setPositionsPersist(state, action: PayloadAction<PositionData[]>) {
//       state.positionsPersist = action.payload;
//     },
//     resetPositions(state) {
//       state.positionsPersist = [];
//     },
//   },
// });

// export const { setPositionsPersist, resetPositions } = SellerSlice.actions;

// export default SellerSlice.reducer;
