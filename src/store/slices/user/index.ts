import { User } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string
  isAuthenticated: boolean
}

const initialUser: UserState = {
  userId: '',
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUserSession: (state, action: PayloadAction<{ userId: string }>) => {
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    deleteUserSession: (state) => {
      state.userId = '';
      state.isAuthenticated = false;
    },
  },
});
