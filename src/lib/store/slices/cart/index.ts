import { Cart } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  cart: Cart;
}

const initialState: CartState = {
  cart: {
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
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.cart.products.find(item => item.id === id);
      if (item) item.quantity = quantity;
    }
  },
});
