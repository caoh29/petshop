import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'

import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// import storage from 'redux-persist/lib/storage';

import { cartSlice } from "./slices/cart";
import { reviewsSlice } from "./slices/reviews";
import { userSlice } from "./slices/user";


const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: 'store',
  storage: storage,
  whiteList: ['cart'],
  blacklist: ['reviews', 'user'],
};

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
  reviews: reviewsSlice.reducer,
  user: userSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}

export const { setCart, addProductToCart, updateProductInCart, deleteProductFromCart, clearCart, setValidatedProducts } = cartSlice.actions;
export const { setReviews } = reviewsSlice.actions;
export const { setUserSession, deleteUserSession, setRedirectPath } = userSlice.actions;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


