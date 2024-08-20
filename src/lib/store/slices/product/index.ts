import { SelectedProduct } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductState {
  product: SelectedProduct;
}

const initialState: ProductState = {
  product: {
    id: 0,
    name: "",
    size: "",
    quantity: 0
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<SelectedProduct>) => {
      state.product = action.payload;
    },
    setSize: (state, action: PayloadAction<string>) => {
      state.product.size = action.payload;
    },
  },
});
