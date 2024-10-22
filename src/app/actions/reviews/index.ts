'use server';

import { getProductByIdAction } from "../products";

// import { addReview } from '@/api/reviews';

export const addReviewAction = async (
  id: string,
  text: string,
  rating: number,
  userId: string,
) => {
  const product = await getProductByIdAction({ id });
  if (product) {
    product.reviews.push({
      rating: rating,
      text: text,
      userId: userId,
      createdAt: new Date().toISOString(),
      // Needs improvement
      id: "",
      productId: ""
    });
  }
  return product?.reviews;
  // const reviews = await addReview(id, { text, rating, userId });
  // return reviews || [];
};