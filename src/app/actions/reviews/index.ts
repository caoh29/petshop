'use server';

import prisma from "../../../../prisma/db";

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
      },
    });

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