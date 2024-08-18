import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useCart = () => useSelector((state: RootState) => state.cart.cart);


export const useReviews = () =>
  useSelector((state: RootState) => state.reviews.reviews);

export const useHeaderVisibility = () =>
  useSelector((state: RootState) => state.header.isVisible);