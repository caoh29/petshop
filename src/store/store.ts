import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./slices/cart";
import { reviewsSlice } from "./slices/reviews";
import { headerSlice } from "./slices/header";
import { selectedProductSlice } from "./slices/product";
import { userSlice } from "./slices/user";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartSlice.reducer,
      reviews: reviewsSlice.reducer,
      header: headerSlice.reducer,
      selectedProduct: selectedProductSlice.reducer,
      user: userSlice.reducer,
    },
  });

export const { setCart, addProductToCart, updateProductInCart, deleteProductFromCart, clearCart } = cartSlice.actions;
export const { setReviews } = reviewsSlice.actions;
export const { setHeaderVisibility } = headerSlice.actions;
export const { setSize, setColor, increaseQuantity, decreaseQuantity, resetProductState } = selectedProductSlice.actions;
export const { setUserSession } = userSlice.actions;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


