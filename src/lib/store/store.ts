import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./slices/cart";
import { reviewsSlice } from "./slices/reviews";

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartSlice.reducer,
      reviews: reviewsSlice.reducer,
    },
  });

export const { setCart } = cartSlice.actions;
export const { setReviews } = reviewsSlice.actions;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


