import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: SellerState = {
  positionsPersist: [],
};

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
});

export const { setPositionsPersist, resetPositions } = SellerSlice.actions;

export default SellerSlice.reducer;
