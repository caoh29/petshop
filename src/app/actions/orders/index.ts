'use server';

import prisma from "../../../../prisma/db";

import { getPagination } from "@/lib/utils";


interface GetOrders {
  userId?: string;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  }
}

interface PaginatedOrders {
  orders: {
    id: string;
    total: number;
    createdAt: Date;
    status: string;
    deliveryMethod: string;
  }[];
  pages: number;
  currentPage: number;
}


const checkSorting = (sortBy: string | undefined): { total: "asc" | "desc" } | { createdAt: "asc" | "desc" } | undefined => {
  if (sortBy === 'total_asc') {
    return { total: "asc" };
  } else if (sortBy === 'total_desc') {
    return { total: "desc" };
  } else if (sortBy === 'newest') {
    return { createdAt: "desc" };
  } else if (sortBy === 'featured') {
    return { createdAt: "asc" };
  } else {
    return undefined;
  }
}


export const getPaginatedOrdersByUserAction = async ({ userId, searchParams }: GetOrders): Promise<PaginatedOrders> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page });

    const sortBy = checkSorting(searchParams?.sort as string);


    // Get the total count of products based on the filters
    const totalCount = await prisma.order.count({
      where: {
        userId,
      }
    });

    const orders = await prisma.order.findMany({
      take,
      skip,
      // include: { user: true, products: true }, // Include reviews in the initial query
      where: {
        userId,
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        status: true,
        deliveryMethod: true,
      },
      orderBy: sortBy ?? undefined,
    });

    return {
      pages: Math.ceil(totalCount / take), // Total number of pages
      currentPage: page ?? 1, // Current page number
      orders,
    }
  } catch (error) {
    console.log(error);
    return {
      orders: [], // Return an empty array in case of error
      pages: 0, // Return 0 pages in case of error
      currentPage: 1 // Return 1 as the current page in case of error
    };
  }
}