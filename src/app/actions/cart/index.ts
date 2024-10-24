'use server';

// import { deleteCartItem, updateCartItem, addToCart, clearCart } from '@/api/cart';
import { Cart, SelectedProduct } from '@/api/types';
import prisma from "../../../../prisma/db";

const getCart = async (userId: string): Promise<Cart> => {
  // Retrieve the cart from the database
  const dbCart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      products: {
        select: {
          productId: true,
          quantity: true,
          size: true,
          color: true,
          product: {
            select: {
              name: true,
              price: true,
              image: true,
              category: true,
              subcategory: true,
            }
          }
        }
      }
    }
    // include: {
    //   products: {
    //     include: {
    //       product: {
    //         select: {
    //           name: true,
    //           price: true,
    //           image: true,
    //           category: true,
    //           subcategory: true,
    //         }
    //       }
    //     },
    //   },
    // }
  });

  // If the cart is not found, return an empty cart structure
  if (!dbCart) {
    return {
      id: '',
      userId,
      products: [],
    };
  }

  // Map the cart data to the expected structure
  const cart: Cart = {
    id: dbCart.id,
    userId: dbCart.userId,
    // Map product object from DB to satisfied frontend requirements SelectedProduct object
    products: dbCart.products.map(({ quantity, size, color, productId, product }) => (
      {
        productId,
        productImage: product.image,
        productName: product.image,
        productPrice: product.price,
        productCategory: product.category,
        productSubcategory: product.subcategory,
        size: size ?? '',
        color: color ?? '',
        quantity: quantity,
      }
    )),
  };

  return cart;
};

export const getCartAction = async (userId: string): Promise<Cart> => getCart(userId ?? '');

export const addProductToCartAction = async (
  productId: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
): Promise<SelectedProduct> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // First, ensure the cart exists
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // Check if the product exists in the cart
  const existingCartProduct = await prisma.selectedProduct.findFirst({
    where: {
      cartId: cart.id,
      productId,
      size: options.size,
      color: options.color,
    },
  });

  let updatedCartProduct;

  if (existingCartProduct) {
    // Update existing cart product
    updatedCartProduct = await prisma.selectedProduct.update({
      where: {
        id: existingCartProduct.id,
      },
      data: {
        quantity: existingCartProduct.quantity + quantity,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            subcategory: true,
          }
        }
      }
    });
  } else {
    // Create new cart product
    updatedCartProduct = await prisma.selectedProduct.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size: options.size,
        color: options.color,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            subcategory: true,
          }
        }
      }
    });
  }

  // Transform the result into SelectedProduct type
  const selectedProduct: SelectedProduct = {
    productId: updatedCartProduct.productId,
    productImage: updatedCartProduct.product.image,
    productName: updatedCartProduct.product.name,
    productPrice: updatedCartProduct.product.price,
    productCategory: updatedCartProduct.product.category,
    productSubcategory: updatedCartProduct.product.subcategory,
    size: updatedCartProduct.size ?? '',
    color: updatedCartProduct.color ?? '',
    quantity: updatedCartProduct.quantity,
  };

  return selectedProduct;
  // return await addToCart(id, {
  //   quantity,
  //   options,
  // });
};

export const updateProductCartAction = async (
  id: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
): Promise<SelectedProduct> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get the cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Update the selected product
  const { count: affectedElements } = await prisma.selectedProduct.updateMany({
    where: {
      cartId: cart.id,
      productId: id,
      size: options.size,
      color: options.color,
    },
    data: {
      quantity: quantity,
    },
  });

  if (affectedElements > 0) {
    const dbSelectedProduct = await prisma.selectedProduct.findFirst({
      where: {
        cartId: cart.id,
        productId: id,
        size: options.size,
        color: options.color,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            subcategory: true,
          }
        }
      }
    });

    const selectedProduct: SelectedProduct = {
      productId: dbSelectedProduct?.productId ?? '',
      productImage: dbSelectedProduct?.product.image ?? '',
      productName: dbSelectedProduct?.product.name ?? '',
      productPrice: dbSelectedProduct?.product.price ?? 0,
      productCategory: dbSelectedProduct?.product.category ?? '',
      productSubcategory: dbSelectedProduct?.product.subcategory ?? '',
      quantity: dbSelectedProduct?.quantity ?? 0
    };

    return selectedProduct;
  };
  throw new Error('Product not found in cart');
  // return await updateCartItem(id, {
  //   quantity,
  //   options,
  // });
}

export const deleteProductCartAction = async (
  id: string,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
): Promise<number> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get the cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Update the selected product
  const { count: affectedElements } = await prisma.selectedProduct.deleteMany({
    where: {
      cartId: cart.id,
      productId: id,
      size: options.size,
      color: options.color,
    },
  });

  if (affectedElements > 0) {
    return affectedElements;
  }

  throw new Error('Product not found in cart');
  // return await deleteCartItem(id, {
  //   options,
  // });
}


export const clearCartAction = async (userId?: string): Promise<Cart> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get the cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Delete all selected products for this cart
  await prisma.selectedProduct.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  // Return the empty cart
  return await getCart(userId);
  // return await clearCart();
};