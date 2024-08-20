import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./slices/cart";
import { reviewsSlice } from "./slices/reviews";
import { headerSlice } from "./slices/header";
import { productSlice } from "./slices/product";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartSlice.reducer,
      reviews: reviewsSlice.reducer,
      header: headerSlice.reducer,
      product: productSlice.reducer,
    },
  });

export const { setCart } = cartSlice.actions;
export const { setReviews } = reviewsSlice.actions;
export const { setHeaderVisibility } = headerSlice.actions;
export const { setProduct, setSize } = productSlice.actions;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


