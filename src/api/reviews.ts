
import { getProductByIdAction } from "@/app/actions";
import { Review } from "./types";

export const addReview = async (
  id: string,
  review: { rating: number; text: string; userId: string }
): Promise<Review[] | undefined> => {
  const product = await getProductByIdAction({ id });
  if (product) {
    product.reviews.push({
      rating: review.rating,
      text: review.text,
      userId: review.userId,
      createdAt: new Date().toISOString(),
      // Needs improvement
      id: "",
      productId: ""
    });
  }
  return product?.reviews;
};