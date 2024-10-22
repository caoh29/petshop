import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  isAuthenticated: boolean
}

const initialUser: UserState = {
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUserSession: (state) => {
      state.isAuthenticated = true;
    },
  },
});
