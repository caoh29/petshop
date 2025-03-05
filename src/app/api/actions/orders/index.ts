'use server';

import { DetailedOrder, SimplifiedOrder } from "@/types/types";
import prisma from "../../../../../prisma/db";

import { checkSorting, getPagination } from "@/lib/utils";
import { auth } from "@/auth";


interface GetOrders {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  }
}

interface PaginatedOrders {
  orders: SimplifiedOrder[];
  pages: number;
  currentPage: number;
}


export const getPaginatedOrdersUserAction = async ({ searchParams }: GetOrders): Promise<PaginatedOrders> => {
  try {
    const session = await auth();

    const userId = session?.user?.id ?? undefined;

    if (!userId) return {
      orders: [], // Return an empty array in case of error
      pages: 0, // Return 0 pages in case of error
      currentPage: 1 // Return 1 as the current page in case of error
    };

    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page });

    const sortBy = checkSorting(searchParams?.sort, 'order');


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
      orderBy: sortBy ?? undefined,
    });

    return {
      pages: Math.ceil(totalCount / take), // Total number of pages
      currentPage: page ?? 1, // Current page number
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(), // Convert createdAt to ISO string
        trackingNumber: order.trackingNumber ?? undefined,
      })),
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

export const getOrderByIdUserAction = async ({ orderId }: { orderId: string; }) => {
  try {
    const session = await auth();

    const userId = session?.user?.id ?? undefined;

    if (!userId) return { order: null };

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId, // Ensure the order belongs to the user
      },
      include: {
        products: {
          include: {
            product: {
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
            }
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
      trackingNumber: order.trackingNumber,
      products: order.products.map((item) => ({
        id: item.productId,
        image: item.product.image,
        name: item.product.name,
        category: item.product.category.name,
        subcategory: item.product.subcategory.name,
        price: item.price ?? 0,
        quantity: item.quantity,
        size: item.size ?? undefined,
        color: item.color ?? undefined,
      })),
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
      },
    };

    return { order: detailedOrder };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { order: null };
  }
}