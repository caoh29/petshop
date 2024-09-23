'use server';

import { Product } from "@/api/types";
import prisma from "../../../../prisma/db";

interface Pagination {
  page?: number;
  take?: number;
}

const getPagination = ({ page = 1, take = 9 }: Pagination) => {
  page = Number(page);
  take = Number(take);
  if (isNaN(page) || isNaN(take)) return { skip: 0, take: 9 };
  const skip = (page - 1) * take;
  return { skip, take };
};

interface GetProducts {
  category?: string;
  subcategory?: string;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  }
}

export const getPaginatedProductsAction = async ({ category, subcategory, searchParams }: GetProducts): Promise<{ products: Product[], pages: number, currentPage: number }> => {
  try {
    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page });

    const sortBy = searchParams?.sort;

    const products = await prisma.product.findMany({
      take,
      skip,
      include: { reviews: true }, // Include reviews in the initial query
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        sizes: searchParams?.Size ? { has: searchParams.Size as string } : undefined,
        colors: searchParams?.Color ? { has: searchParams.Color as string } : undefined,
        // sizes: searchParams?.Size ? { hasSome: searchParams.Size as string[] } : undefined,
        // colors: searchParams?.Color ? { hasSome: searchParams.Color as string[] } : undefined,
      },
      // orderBy: sortBy ? { price: sortBy as "asc" | "desc", createdAt: sortBy === 'newest' ? 'desc' : 'asc', } : undefined,
    });

    return {
      pages: Math.ceil((await prisma.product.count({
        where: {
          category: category ?? undefined,
          subcategory: subcategory ?? undefined,
        }
      })) / take), // Total number of pages
      currentPage: page ?? 1, // Current page number
      products: products.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(), // Convert Date to string
        reviews: product.reviews.map(review => ({
          ...review,
          createdAt: review.createdAt.toISOString() // Convert Date to string
        }))
      })),
    }
  } catch (error) {
    console.log(error);
    return {
      products: [], // Return an empty array in case of error
      pages: 0, // Return 0 pages in case of error
      currentPage: 1 // Return 1 as the current page in case of error
    };
  }
};

export const getProductByIdAction = async ({
  id
}: {
  id: string;
}) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        reviews: true,
      }
    });

    if (!product) return null;

    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      reviews: product.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString()
      }))
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};