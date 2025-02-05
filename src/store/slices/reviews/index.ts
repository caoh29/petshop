import { Review } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReviewsState {
  reviews: Review[] | null;
}

const initialReviews: ReviewsState = {
  reviews: null,
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState: initialReviews,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
  },
});
