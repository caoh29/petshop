import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

export const useCart = () => useSelector((state: RootState) => state.cart.cart);

export const useReviews = () =>
  useSelector((state: RootState) => state.reviews.reviews);

export const useUser = () =>
  useSelector((state: RootState) => state.user);

export const useCheckout = () =>
  useSelector((state: RootState) => state.checkout);


export const useAppDispatch: () => AppDispatch = useDispatch;