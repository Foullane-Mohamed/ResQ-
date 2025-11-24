import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  statusFilter: 'ALL' | 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';
}

const initialState: FilterState = {
  statusFilter: 'ALL',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterState['statusFilter']>) => {
      state.statusFilter = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;