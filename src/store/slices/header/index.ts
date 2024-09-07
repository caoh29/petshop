import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HeaderState {
  isVisible: boolean;
}

const initialState: HeaderState = {
  isVisible: true,
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderVisibility: (state, action: PayloadAction<HeaderState>) => {
      state.isVisible = action.payload.isVisible;
    },
  },
});
