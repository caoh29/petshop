import { Cart } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  cart: Cart;
}

const initialState: CartState = {
  cart: {
    id: "",
    userId: "",
    products: [],
  },
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
  },
});
