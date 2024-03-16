import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types & Interfaces
import { DailyTaskState } from "@interfaces/dailyTask";
import type { RootState } from "@app/store";

// State
const initialState: DailyTaskState = {
  startDate: null,
  endDate: null,
};

// Slice
export const dailyTaskSlice = createSlice({
  name: "dailyTask",
  initialState,
  reducers: {
    setDates: (state, action: PayloadAction<DailyTaskState>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

// Actions
export const { setDates } = dailyTaskSlice.actions;

// Selectors
export const selectStartDate = (state: RootState) => state.dailyTask.startDate;
export const selectEndDate = (state: RootState) => state.dailyTask.endDate;

// Reducer
export default dailyTaskSlice.reducer;
