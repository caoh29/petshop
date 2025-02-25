"use server";

import { auth } from "@/auth";

import prisma from "../../../../../prisma/db";

import { getPagination, checkSorting } from "@/lib/utils";
import { DetailedOrder, SimplifiedOrder, SimplifiedUser } from "@/types/types";
import { revalidatePath } from "next/cache";

interface GetUsers {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  }
}

interface PaginatedUsers {
  users: SimplifiedUser[];
  pages: number;
  currentPage: number;
}


export const getPaginatedUsersAdminAction = async ({ searchParams }: GetUsers): Promise<PaginatedUsers> => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return {
      users: [], // Return an empty array in case of error
      pages: 0, // Return 0 pages in case of error
      currentPage: 1 // Return 1 as the current page in case of error
    };

    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page });

    const sortBy = checkSorting(searchParams?.sort, 'user');

    const onlyAdmins = searchParams?.onlyAdmins === 'true';

    if (onlyAdmins) {
      const totalCount = await prisma.user.count({
        where: {
          isAdmin: true,
        }
      });

      const users = await prisma.user.findMany({
        where: {
          isAdmin: true,
        },
        take,
        skip,
        orderBy: sortBy ?? undefined,
      });

      return {
        pages: Math.ceil(totalCount / take), // Total number of pages
        currentPage: page ?? 1, // Current page number
        users: users.map((user) => ({
          ...user,
          name: user.name ?? undefined,
          createdAt: user.createdAt.toISOString(),
          phone: user.phone ?? undefined,
          isVerified: user.isVerified ?? undefined,
          isGuest: user.isGuest ?? false,
          isAdmin: user.isAdmin ?? false,
        })),
      }
    }


    // Get the total count of products based on the filters
    const totalCount = await prisma.user.count();

    const users = await prisma.user.findMany({
      take,
      skip,
      where: {
        isAdmin: false,
      },
      orderBy: sortBy ?? undefined,
    });

    return {
      pages: Math.ceil(totalCount / take), // Total number of pages
      currentPage: page ?? 1, // Current page number
      users: users.map((user) => ({
        ...user,
        name: user.name ?? undefined,
        createdAt: user.createdAt.toISOString(),
        phone: user.phone ?? undefined,
        isVerified: user.isVerified ?? undefined,
        isGuest: user.isGuest ?? false,
        isAdmin: user.isAdmin ?? false,
      })),
    }
  } catch (error) {
    console.log(error);
    return {
      users: [], // Return an empty array in case of error
      pages: 0, // Return 0 pages in case of error
      currentPage: 1 // Return 1 as the current page in case of error
    };
  }
}

export const getUserByIdAdminAction = async (userId: string) => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return {
      user: null,
      errors: ["Unauthorized"],
      message: "You are Unauthorized",
    };

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return {
        user: null,
        errors: ["User not found"],
        message: "User not found"
      };
    }

    return { user };
  } catch (error) {
    console.log(error);
    return {
      user: null,
      errors: ["Something went wrong"],
      message: "Something went wrong",
    };
  }
}


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


export const getPaginatedOrdersAdminAction = async ({ searchParams }: GetOrders): Promise<PaginatedOrders> => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return {
      orders: [], // Return an empty array in case of error
      pages: 0, // Return 0 pages in case of error
      currentPage: 1 // Return 1 as the current page in case of error
    };

    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page });

    const sortBy = checkSorting(searchParams?.sort, 'order');


    // Get the total count of products based on the filters
    const totalCount = await prisma.order.count();

    const orders = await prisma.order.findMany({
      take,
      skip,
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


export const getOrderByIdAdminAction = async ({ orderId }: { orderId: string; }) => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return { order: null };

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
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
      trackingNumber: order.trackingNumber,
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

export const promoteUserToAdminAction = async (userId: string) => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return { errors: ["Unauthorized"], message: "You are Unauthorized" };

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isAdmin: true,
      }
    });

    revalidatePath(`/admin/users/${user.id}`);

    return {
      data: {
        email: user.email,
        isAdmin: user.isAdmin ?? false
      }, message: "The user has been promoted to admin."
    };
  } catch (error) {
    console.log(error);
    return { errors: ["Something went wrong"], message: "Something went wrong" };
  }
}

export const inactivateUserAdminAction = async (userId: string) => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return { errors: ["Unauthorized"], message: "You are Unauthorized" };

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: false,
        isAdmin: false,
      }
    });

    revalidatePath(`/admin/users/${user.id}`);

    return {
      data: {
        email: user.email,
        isActive: user.isActive ?? false
      }, message: "The user has been inactivated."
    };
  } catch (error) {
    console.log(error);
    return { errors: ["Something went wrong"], message: "Something went wrong" };
  }
}