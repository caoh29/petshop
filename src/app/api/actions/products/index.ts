'use server';

import { FilterGroup, Product } from "@/types/types";
import prisma from "../../../../../prisma/db";

import { checkSearchParam, checkSorting, getPagination } from "@/lib/utils";

interface GetProducts {
  category?: string;
  subcategory?: string;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  },
  take?: number;
}

export const getPaginatedProductsAction = async ({ category, subcategory, searchParams, take: userTake }: GetProducts): Promise<{ products: Product[], pages: number, currentPage: number }> => {
  try {
    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page, take: userTake });

    const sizes = checkSearchParam(searchParams?.Size);
    const colors = checkSearchParam(searchParams?.Color);
    const sortBy = checkSorting(searchParams?.sort, 'product');
    const query = searchParams?.query as string;


    // Get the total count of products based on the filters
    const totalCount = await prisma.product.count({
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
      }
    });

    const products = await prisma.product.findMany({
      take,
      skip,
      include: { reviews: true }, // Include reviews in the initial query
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
      },
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

export const getFeaturedProductsAction = async ({ category, subcategory, searchParams, take: userTake }: GetProducts): Promise<{ products: Product[], pages: number, currentPage: number }> => {
  try {
    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page, take: userTake });

    const sizes = checkSearchParam(searchParams?.Size);
    const colors = checkSearchParam(searchParams?.Color);
    const sortBy = checkSorting(searchParams?.sort, 'product');
    const query = searchParams?.query as string;


    // Get the total count of products based on the filters
    const totalCount = await prisma.product.count({
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
        stock: { gt: 0 },
        isOutOfStock: false,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 120)), // Products created within the last N days
        }
      }
    });

    const products = await prisma.product.findMany({
      take,
      skip,
      include: { reviews: true }, // Include reviews in the initial query
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
        discount: 0,
        stock: { gt: 0 },
        isOutOfStock: false,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 120)), // Products created within the last N days
        }
      },
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

export const getPaginatedDealsAction = async ({ take: userTake, searchParams }: GetProducts): Promise<{ products: Product[], pages: number, currentPage: number }> => {
  try {
    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ take: userTake });

    // Get the total count of products based on the filters
    const totalCount = await prisma.product.count({
      where: {
        discount: {
          gt: 0
        }
      }
    });

    const products = await prisma.product.findMany({
      take,
      skip,
      include: { reviews: true },
      where: {
        discount: {
          gt: 0
        }
      },
      orderBy: {
        discount: 'desc'
      },
    });

    return {
      pages: Math.ceil(totalCount / take), // Total number of pages
      currentPage: page ?? 1, // Current page number
      products: products.map(product => ({
        ...product,
        discountedPrice: product.price - (product.price * product.discount / 100),
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
}): Promise<Product | null> => {
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
    const query = searchParams?.query as string;

    const filters = await prisma.product.findMany({
      where: {
        category: category ?? undefined,
        subcategory: subcategory ?? undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
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


