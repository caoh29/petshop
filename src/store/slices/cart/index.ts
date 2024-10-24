import { Cart, SelectedProduct } from "@/api/types";
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
    // addProductToCart: (state, action: PayloadAction<SelectedProduct>) => {
    //   if (state.cart.products.some((p) => p.productId === action.payload.productId && p.size === action.payload.size && p.color === action.payload.color)) {
    //     state.cart.products = state.cart.products.map((p) => {
    //       if (p.productId === action.payload.productId) {
    //         return {
    //           ...p,
    //           quantity: p.quantity + action.payload.quantity,
    //         };
    //       }
    //       return p;
    //     });
    //   }
    //   else {
    //     state.cart.products.push(action.payload);
    //   }
    // }
    addProductToCart: (state, action: PayloadAction<SelectedProduct>) => {
      const existingProductIndex = state.cart.products.findIndex(
        (p) => p.productId === action.payload.productId &&
          p.size === action.payload.size &&
          p.color === action.payload.color
      );

      if (existingProductIndex !== -1) {
        state.cart.products[existingProductIndex].quantity += action.payload.quantity;
      } else {
        state.cart.products.push(action.payload);
      }
    },

    updateProductInCart: (
      state,
      action: PayloadAction<SelectedProduct>
    ) => {
      const existingProductIndex = state.cart.products.findIndex(
        (p) => p.productId === action.payload.productId &&
          p.size === action.payload.size &&
          p.color === action.payload.color
      );

      if (existingProductIndex !== -1) {
        state.cart.products[existingProductIndex].quantity = action.payload.quantity;
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
          p.productId !== action.payload.productId &&
          p.size !== action.payload.size &&
          p.color !== action.payload.color
      );
    },

    clearCart: (state) => {
      state.cart = initialState.cart;
    },
  }
});
