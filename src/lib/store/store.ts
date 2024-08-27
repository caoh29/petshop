import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./slices/cart";
import { reviewsSlice } from "./slices/reviews";
import { headerSlice } from "./slices/header";
import { selectedProductSlice } from "./slices/product";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartSlice.reducer,
      reviews: reviewsSlice.reducer,
      header: headerSlice.reducer,
      selectedProduct: selectedProductSlice.reducer,
    },
  });

export const { setCart, updateItemQuantity } = cartSlice.actions;
export const { setReviews } = reviewsSlice.actions;
export const { setHeaderVisibility } = headerSlice.actions;
export const { setSize,  setColor, setQuantity, increaseQuantity, decreaseQuantity, resetProductState } = selectedProductSlice.actions;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


