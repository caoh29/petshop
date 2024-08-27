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
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number; size?: string; color?: string; }>) => {
      const { id, quantity, size, color } = action.payload;
      let item = null;

      const items = state.cart.products.filter(item => item.id === id);
      if (items.length === 1) {
        item = items[0];
      } else {
        const itemsBySize = items.filter(item => item.size === size);
        if (itemsBySize.length === 1) {
          item = itemsBySize[0];
        } else {
          const itemsByColor = itemsBySize.filter(item => item.color === color);
          if (itemsByColor.length === 1) {
            item = itemsByColor[0];
          }
        }
      }
      if (item) item.quantity = quantity;
    }
  },
});
