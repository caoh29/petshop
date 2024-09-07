'use server';

import { Product } from "@/api/types";
import prisma from "../../../../prisma/db";

export const getPaginatedProducts = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      take: 10,
      include: { reviews: true } // Include reviews in the initial query
    });

    return products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(), // Convert Date to string
      reviews: product.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString() // Convert Date to string
      }))
    }));
  } catch (error) {
    console.log(error);
    return []; // Return an empty array in case of error
  }
};