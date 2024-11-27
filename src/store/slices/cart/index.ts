import { Cart, SelectedProduct, ValidProduct } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  cart: Cart;
}

const initialState: CartState = {
  cart: {
    id: "",
    userId: "",
    products: [],
    validatedProducts: []
  },
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },

    addProductToCart: (state, action: PayloadAction<SelectedProduct>) => {
      const existingProduct = state.cart.products.find(
        (p) => p.productId === action.payload.productId &&
          p.size === action.payload.size &&
          p.color === action.payload.color
      );

      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.cart.products.push(action.payload);
      }
    },

    updateProductInCart: (
      state,
      action: PayloadAction<SelectedProduct>
    ) => {
      const existingProduct = state.cart.products.find(
        (p) => p.productId === action.payload.productId &&
          p.size === action.payload.size &&
          p.color === action.payload.color
      );

      if (existingProduct && action.payload.quantity > 0 && action.payload.quantity < 100) {
        existingProduct.quantity = action.payload.quantity;
      }
    },

    deleteProductFromCart: (
      state,
      action: PayloadAction<{
        productId: string;
        size: string;
        color: string;
      }>
    ) => {
      state.cart.products = state.cart.products.filter(
        (p) =>
          p.productId !== action.payload.productId ||
          p.size !== action.payload.size ||
          p.color !== action.payload.color
      );
    },

    clearCart: (state) => {
      state.cart = initialState.cart;
    },

    setValidatedProducts: (state, action: PayloadAction<ValidProduct[]>) => {
      state.cart.validatedProducts = action.payload;
    }
  }
});
