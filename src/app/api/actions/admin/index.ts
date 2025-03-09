"use server";

import { auth } from "@/auth";

import prisma from "../../../../../prisma/db";

import { getPagination, checkSorting } from "@/lib/utils";
import { DetailedOrder, Product, SimplifiedOrder, SimplifiedProduct, SimplifiedUser } from "@/types/types";
import { revalidatePath } from "next/cache";
import { SchemaCreateProduct, schemaCreateProduct } from "@/lib/schemas/create-product";
import { schemaEditProduct, SchemaEditProduct } from "@/lib/schemas/edit-product";

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
            product: {
              include: {
                category: {
                  select: {
                    name: true,
                  }
                },
                subcategory: {
                  select: {
                    name: true,
                  }
                },
              },
            },
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

export const getPaginatedProductsAdminAction = async ({ searchParams }: GetProducts): Promise<PaginatedProducts> => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return { products: [], pages: 0, currentPage: 1 };

    const page = Number(searchParams?.page) ?? 1;

    const { skip, take } = getPagination({ page });

    const sortBy = checkSorting(searchParams?.sort, 'product');

    const totalCount = await prisma.product.count();

    const products = await prisma.product.findMany({
      take,
      skip,
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
      products: products.map((product) => ({
        ...product,
        category: product.category.name,
        subcategory: product.subcategory.name,
        createdAt: product.createdAt.toISOString(),
      })),
    }
  } catch (error) {
    console.log(error);
    return { products: [], pages: 0, currentPage: 1 };
  }
}

export const getProductByIdAdminAction = async (productId: string): Promise<{ product: Product | null }> => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return { product: null };

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: true,
        // category: {
        //   select: {
        //     name: true,
        //   },
        // },
        // subcategory: {
        //   select: {
        //     name: true,
        //   },
        // },
      },
    });

    if (!product) return { product: null };

    return {
      product: {
        ...product,
        // category: product.category.name,
        // subcategory: product.subcategory.name,
        category: product.categoryId,
        subcategory: product.subcategoryId,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        reviews: product.reviews.map((review) => ({
          ...review,
          createdAt: review.createdAt.toISOString(),
        })),
      }
    }

  } catch (error) {
    console.log(error);
    return { product: null };
  }
}

export const createProductAdminAction = async (values: SchemaCreateProduct) => {
  try {
    // Validate form data using Zod
    const validatedFields = await schemaCreateProduct.safeParseAsync(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const data = validatedFields.data;

    // // Handle avatar image
    // const avatarImage = formData.get("avatarImage") as File;
    // let avatarImageUrl = "";

    // if (avatarImage && avatarImage.size > 0) {
    //   avatarImageUrl = await uploadFile(avatarImage);
    // }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        categoryId: data.category,
        subcategoryId: data.subcategory,
        stock: data.stock,
        sizes: data.sizes,
        availableSizes: data.availableSizes,
        colors: data.colors,
        availableColors: data.availableColors,
        sku: data.sku,
        isOutOfStock: data.isOutOfStock,
        image: data.image,
        additionalImages: data.additionalImages
      },
    });

    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
};

async function uploadFile(file: File): Promise<string> {
  // In a real implementation, you would:
  // 1. Upload the file to a storage service (S3, Cloudinary, etc.)
  // 2. Return the URL of the uploaded file

  // For this example, we'll just return a placeholder URL
  console.log(`Uploading file: ${file.name}`)
  return `/uploads/${Date.now()}-${file.name}`
}

export const updateProductAdminAction = async (productId: string, values: SchemaEditProduct) => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return {
      success: false,
      message: "Unauthorized"
    };

    // Validate form data using Zod
    const validatedFields = await schemaEditProduct.safeParseAsync(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const data = validatedFields.data;

    // // Handle avatar image if provided
    // const avatarImage = formData.get("avatarImage") as File;
    // let imageUpdate = {};

    // if (avatarImage && avatarImage.size > 0) {
    //   const avatarImageUrl = await uploadFile(avatarImage);
    //   imageUpdate = { image: avatarImageUrl };
    // }

    // Update product in database
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        categoryId: data.category,
        subcategoryId: data.subcategory,
        stock: data.stock,
        sizes: data.sizes,
        availableSizes: data.availableSizes,
        colors: data.colors,
        availableColors: data.availableColors,
        sku: data.sku,
        isOutOfStock: data.isOutOfStock,
        image: data.image,
        additionalImages: data.additionalImages,
      },
    });

    revalidatePath(`/admin/products/${productId}`);

    return {
      success: true,
      message: "Product updated successfully",
      product
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product"
    };
  }
};

export const deleteProductAdminAction = async (productId: string) => {
  try {
    const session = await auth();

    if (!session?.user.isAdmin) return {
      success: false,
      message: "Unauthorized"
    };

    // mark as discontinued product
    await prisma.product.update({
      where: { id: productId },
      data: {
        isDiscounted: true,
        isOutOfStock: true,
        stock: 0,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product"
    };
  }
};