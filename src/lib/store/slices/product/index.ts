import { SelectedProduct } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedProductState {
  selectedProduct: SelectedProduct;
}

const initialState: SelectedProductState = {
  selectedProduct: {
    size: '',
    color: '',
    quantity: 1,
    id: 0,
    name: "",
    image: "",
    price: 0,
    category: "",
    subcategory: "",
    description: "",
    reviews: [],
    isOutOfStock: false
  },
};

export const selectedProductSlice = createSlice({
  name: "selectedProduct",
  initialState,
  reducers: {
    setSize: (state, action: PayloadAction<string>) => {
      state.selectedProduct.size = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.selectedProduct.color = action.payload;
    },
    increaseQuantity: (state) => {
      state.selectedProduct.quantity = state.selectedProduct.quantity + 1;
    },
    decreaseQuantity: (state) => {
      if (state.selectedProduct.quantity > 1) {
        state.selectedProduct.quantity = state.selectedProduct.quantity - 1;
      }
    },
    resetProductState: (state) => {
      state.selectedProduct = initialState.selectedProduct;
    },
  },
});
