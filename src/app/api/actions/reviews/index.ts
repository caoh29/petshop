'use server';

import { revalidatePath } from "next/cache";
import prisma from "../../../../../prisma/db";

export const addReviewAction = async (
  productId: string,
  text: string,
  rating: number,
  userId: string,
) => {
  try {
    await prisma.review.create({
      data: {
        text,
        rating,
        userId,
        productId,
      },
    });

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      }, select: {
        product: {
          select: {
            category: true,
            subcategory: true,
          }
        },
        id: true,
        productId: true,
        createdAt: true,
        text: true,
        rating: true,
        userId: true,
      }
    });


    revalidatePath(`/${reviews[0].product.category}/${reviews[0].product.subcategory}/${productId}`);

    return reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    }));
  }
  catch (error) {
    console.log(error);
    return [];
  }
};