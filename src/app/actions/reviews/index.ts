'use server';

import { addReview } from '@/api/reviews';

export const addReviewAction = async (
  id: string,
  text: string,
  rating: number,
  userId: string,
) => {
  const reviews = await addReview(id, { text, rating, userId });
  return reviews || [];
};