'use server';

import { FilterGroup, Product } from "@/api/types";
import prisma from "../../../../prisma/db";

interface GetProducts {
  category?: string;
  subcategory?: string;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  }
}

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

const checkSearchParam = (searchParam: string | string[] | undefined): string[] | undefined => {
  if (Array.isArray(searchParam)) {
    return searchParam;
  } else if (typeof searchParam === 'string') {
    return [searchParam];
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

export const getRelatedProductsAction = async ({ id, category, subcategory }: { id: string, category?: string, subcategory?: string }) => {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: { reviews: true },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        NOT: {
          id: id,
        },
      },
    });

    return products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      reviews: product.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString()
      }))
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const searchProductAction = async (query: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
      include: { reviews: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      reviews: product.reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString()
      }))
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getFiltersAction = async ({ category, subcategory, searchParams }: GetProducts): Promise<{ filters: FilterGroup[] }> => {
  try {
    const filters = await prisma.product.findMany({
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
      },
      select: {
        sizes: true,
        colors: true,
      },
    });

    const sizes = Array.from(new Set(filters.flatMap(filter => filter.sizes))).sort();
    const colors = Array.from(new Set(filters.flatMap(filter => filter.colors))).sort();


    const filterGroups: FilterGroup[] = [
      {
        name: 'Size',
        options: sizes.map(size => ({ id: size, label: size })),
      },
      {
        name: 'Color',
        options: colors.map(color => ({ id: color, label: color.charAt(0).toUpperCase() + color.slice(1) })),
      },
    ];

    return { filters: filterGroups };
  } catch (error) {
    console.error('Error fetching filters:', error);
    return {
      filters: []
    };
  }
}


