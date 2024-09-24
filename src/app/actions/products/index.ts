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

    const sizes = checkSearchParam(searchParams?.Size);
    const colors = checkSearchParam(searchParams?.Color);
    const sortBy = checkSorting(searchParams?.sort as string);

    // Create the where clause for the product count query
    const countWhereClause = {
      category: category ?? undefined,
      subcategory: subcategory ?? undefined,
      sizes: sizes ? { hasSome: sizes } : undefined,
      colors: colors ? { hasSome: colors } : undefined,
    };

    // Get the total count of products based on the filters
    const totalCount = await prisma.product.count({
      where: countWhereClause
    });

    const products = await prisma.product.findMany({
      take,
      skip,
      include: { reviews: true }, // Include reviews in the initial query
      where: countWhereClause,
      orderBy: sortBy ?? undefined,
    });

    return {
      pages: Math.ceil(totalCount / take), // Total number of pages
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


const checkSearchParam = (param: string | string[] | undefined): string[] | undefined => {
  if (Array.isArray(param)) {
    return param;
  } else if (typeof param === 'string') {
    return [param];
  }
  return undefined;
}

const checkSorting = (sortBy: string | undefined): { price: "asc" | "desc" } | { createdAt: "asc" | "desc" } | undefined => {
  if (sortBy === 'price_asc') {
    return { price: "asc" };
  } else if (sortBy === 'price_desc') {
    return { price: "desc" };
  } else if (sortBy === 'newest') {
    return { createdAt: "desc" };
  } else if (sortBy === 'featured') {
    return { createdAt: "asc" };
  } else {
    return undefined;
  }
}