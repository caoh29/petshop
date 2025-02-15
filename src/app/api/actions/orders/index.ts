'use server';

import { DetailedOrder } from "@/types/types";
import prisma from "../../../../../prisma/db";

import { getPagination } from "@/lib/utils";
import { auth } from "@/auth";


interface GetOrders {
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


export const getPaginatedOrdersByUserAction = async ({ searchParams }: GetOrders): Promise<PaginatedOrders> => {
  try {
    const session = await auth();

    const userId = session?.user?.id ?? undefined;

    // if (!session) return {
    //   errors: ["Unauthorized"],
    //   message: "You are Unauthorized",
    // };

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

export const getOrderByIdAction = async ({ orderId }: { orderId: string; }) => {
  try {
    const session = await auth();

    const userId = session?.user?.id ?? undefined;

    // if (!session) return {
    //   errors: ["Unauthorized"],
    //   message: "You are Unauthorized",
    // };

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId, // Ensure the order belongs to the user
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return { order: null };
    }

    const detailedOrder: DetailedOrder = {
      ...order,
      trackingNumber: order.trackingNumber ?? undefined,
      products: order.products.map((item) => ({
        id: item.productId,
        image: item.product.image,
        name: item.product.name,
        category: item.product.category,
        subcategory: item.product.subcategory,
        price: item.price ?? 0,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      })),
      user: {
        id: order.user.id,
        name: order.user.name ?? undefined,
        email: order.user.email,
        phone: order.user.phone ?? undefined,
      },
    };

    return { order: detailedOrder };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { order: null };
  }
}