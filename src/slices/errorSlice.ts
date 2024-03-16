import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Store
import { RootState } from "@app/store";

// Interfaces
import { ErrorState } from "@interfaces/error";

// State
const initialState: ErrorState = {
  id: null,
  message: null,
};

// Slice
const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    getErrors: (state, action: PayloadAction<ErrorState>) => {
      state.id = action.payload.id;
      state.message = action.payload.message;
    },
    clearErrors: (state) => {
      state.id = null;
      state.message = null;
    },
  },
});

export const { getErrors, clearErrors } = errorSlice.actions;

// Selectors
export const selectError = (state: RootState) => state.error;

export default errorSlice.reducer;
