import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string
  isAdmin: boolean
  isAuthenticated: boolean
}

const initialUser: UserState = {
  userId: '',
  isAdmin: false,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUserSession: (state, action: PayloadAction<{ userId: string, isAdmin: boolean }>) => {
      state.userId = action.payload.userId;
      state.isAdmin = action.payload.isAdmin;
      state.isAuthenticated = true;
    },
    deleteUserSession: (state) => {
      state.userId = '';
      state.isAdmin = false;
      state.isAuthenticated = false;
    },
  },
});
