import { SelectedProduct } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedProductState {
  product: SelectedProduct;
}

const initialState: SelectedProductState = {
  product: {
    size: '',
    color: '',
    quantity: 1
  },
};

export const productSlice = createSlice({
  name: "selectedProduct",
  initialState,
  reducers: {
    setSize: (state, action: PayloadAction<string>) => {
      state.product.size = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.product.color = action.payload;
    },
    increaseQuantity: (state) => {
      state.product.quantity = state.product.quantity + 1;
    },
    decreaseQuantity: (state) => {
      if (state.product.quantity > 1) {
        state.product.quantity = state.product.quantity - 1;
      }
    },
    resetProductState: (state) => {
      state.product = initialState.product;
    },
  },
});
