'use server';

import { FilterGroup, Product, SimplifiedProduct } from "@/types/types";
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

interface PaginatedProducts {
  products: SimplifiedProduct[];
  pages: number;
  currentPage: number;
}

export const getPaginatedProductsAction = async ({ category, subcategory, searchParams, take: userTake }: GetProducts): Promise<PaginatedProducts> => {
  try {
    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page, take: userTake });

    const sizes = checkSearchParam(searchParams?.Size);
    const colors = checkSearchParam(searchParams?.Color);
    const sortBy = checkSorting(searchParams?.sort, 'product');
    const query = searchParams?.query as string;


    const categoryId = category ? await prisma.category.findFirst({
      where: {
        name: category,
      },
      select: {
        id: true,
      },
    }) : undefined;

    const subcategoryId = subcategory ? await prisma.subCategory.findFirst({
      where: {
        name: subcategory,
        categoryId: categoryId?.id ?? undefined,
      },
      select: {
        id: true,
      },
    }) : undefined;


    // Get the total count of products based on the filters
    const totalCount = await prisma.product.count({
      where: {
        categoryId: categoryId?.id,
        subcategoryId: subcategoryId?.id,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
      }
    });

    const products = await prisma.product.findMany({
      take,
      skip,
      where: {
        categoryId: categoryId?.id,
        subcategoryId: subcategoryId?.id,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
      },
      orderBy: sortBy ?? undefined,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      pages: Math.ceil(totalCount / take), // Total number of pages
      currentPage: page ?? 1, // Current page number
      products: products.map(product => ({
        ...product,
        category: product.category.name,
        subcategory: product.subcategory.name,
        createdAt: product.createdAt.toISOString(), // Convert Date to string
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

    const categoryId = category ? await prisma.category.findFirst({
      where: {
        name: category,
      },
      select: {
        id: true,
      },
    }) : undefined;

    const subcategoryId = subcategory ? await prisma.subCategory.findFirst({
      where: {
        name: subcategory,
        categoryId: categoryId?.id ?? undefined,
      },
      select: {
        id: true,
      },
    }) : undefined;

    // Get the total count of products based on the filters
    const totalCount = await prisma.product.count({
      where: {
        categoryId: categoryId?.id,
        subcategoryId: subcategoryId?.id,
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
      include: {
        reviews: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      }, // Include reviews in the initial query
      where: {
        categoryId: categoryId?.id,
        subcategoryId: subcategoryId?.id,
        sizes: sizes ? { hasSome: sizes } : undefined,
        colors: colors ? { hasSome: colors } : undefined,
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
        category: product.category.name,
        subcategory: product.subcategory.name,
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
      include: {
        reviews: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
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
        category: product.category.name,
        subcategory: product.subcategory.name,
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
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      category: product.category.name,
      subcategory: product.subcategory.name,
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

    const categoryId = category ? await prisma.category.findFirst({
      where: {
        name: category,
      },
      select: {
        id: true,
      },
    }) : undefined;

    const subcategoryId = subcategory ? await prisma.subCategory.findFirst({
      where: {
        name: subcategory,
        categoryId: categoryId?.id ?? undefined,
      },
      select: {
        id: true,
      },
    }) : undefined;


    const products = await prisma.product.findMany({
      take: 4,
      include: {
        reviews: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
      where: {
        categoryId: categoryId?.id,
        subcategoryId: subcategoryId?.id,
        NOT: {
          id: id,
        },
      },
    });

    return products.map(product => ({
      ...product,
      category: product.category.name,
      subcategory: product.subcategory.name,
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
      include: {
        reviews: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    });

    return products.map(product => ({
      ...product,
      category: product.category.name,
      subcategory: product.subcategory.name,
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

    // Early return for invalid query format
    if (Array.isArray(query)) {
      return { filters: [] };
    }

    // Find category ID
    const categoryId = category
      ? await prisma.category.findFirst({
        where: { name: category },
        select: { id: true }
      })
      : undefined;

    // Find subcategory ID based on category
    const subcategoryId = subcategory && categoryId
      ? await prisma.subCategory.findFirst({
        where: {
          name: subcategory,
          categoryId: categoryId.id,
        },
        select: { id: true }
      })
      : undefined;

    // Fetch products with the specified filters
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId?.id,
        subcategoryId: subcategoryId?.id,
        name: query ? { contains: query, mode: 'insensitive' } : undefined,
      },
      select: {
        sizes: true,
        colors: true,
      },
      orderBy: {
        sizes: 'desc',
      },
    });

    // Return empty filters if no products found
    if (products.length === 0) {
      return { filters: [] };
    }

    // Collect unique sizes and colors
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();

    // Populate sets with unique values
    products.forEach(product => {
      product.sizes.forEach(size => sizeSet.add(String(size)));
      product.colors.forEach(color => colorSet.add(String(color)));
    });

    // Convert sets to arrays for the filter groups
    const sizeArray = Array.from(sizeSet);
    const colorArray = Array.from(colorSet);

    // Create filter groups with proper formatting
    const filterGroups: FilterGroup[] = [
      {
        name: 'Size',
        options: sizeArray.map(size => ({
          id: size,
          label: size
        })),
      },
      {
        name: 'Color',
        options: colorArray.map(color => ({
          id: color,
          label: color.charAt(0).toUpperCase() + color.slice(1)
        })),
      },
    ];

    return { filters: filterGroups };
  } catch (error) {
    console.error('Error fetching filters:', error);
    // Log detailed error for debugging but return a generic message
    return {
      filters: []
    };
  }
}


