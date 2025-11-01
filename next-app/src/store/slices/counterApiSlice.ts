// counterSlice.ts
// reduxjs/toolkitで使用する場合の「reducer」の役割
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchRecentItems, type Item} from '@/lib/api';

interface CounterState {
  data: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const initialState: CounterState = {
  data: [],
  status: 'idle',
  error: null,
};

export const addAsyncThunk = createAsyncThunk(
  'addAsync',
  async () => {
    const response = await fetchRecentItems(10);
    console.log(response);
    return response;
}
);

export const counterAPISlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    clearApiData: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAsyncThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addAsyncThunk.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(addAsyncThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { clearApiData } = counterAPISlice.actions;
export default counterAPISlice.reducer;