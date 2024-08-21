import { SelectedProduct } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductState {
  product: SelectedProduct;
}

const initialState: ProductState = {
  product: {
    id: 0,
    size: "",
    quantity: 1
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.product.id = action.payload;
    },
    setSize: (state, action: PayloadAction<string>) => {
      state.product.size = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.product.quantity = action.payload;
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
