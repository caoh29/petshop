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

export const addToCartAction = async (
  productId: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
) => {
  const cart = await getCart(userId ?? '');
  const existingItem = cart.products.find(
    (item) =>
      item.productId === productId &&
      item.size === options.size &&
      item.color === options.color
  );

  if (existingItem) {
    // Item with the same id, size, and color already exists, update its quantity
    await prisma.selectedProduct.update({
      where: { id: existingItem.productId },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    // Item doesn't exist, add it to the cart
    await prisma.selectedProduct.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size: options.size ?? null,
        color: options.color ?? null,
      },
    });
  }
  // Return the updated item
  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      products: true,
    },
  });

  return updatedCart?.products.filter((p) => p.productId === productId)[0];
  // return await addToCart(id, {
  //   quantity,
  //   options,
  // });
};

export const updateCartAction = async (
  id: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
) => {
  const cart = await getCart(userId ?? '');

  const existingItemIndex = cart.products.findIndex(
    (item: SelectedProduct) =>
      item.productId === id &&
      item.size === (options.size ?? '') &&
      item.color === (options.color ?? ''),
  );
  if (existingItemIndex !== -1) {
    cart.products[existingItemIndex].quantity = quantity;
  }
  return cart;
  // return await updateCartItem(id, {
  //   quantity,
  //   options,
  // });
};

export const deleteCartAction = async (
  id: string,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
) => {
  const cart = await getCart(userId ?? '');

  const existingItemIndex = cart.products.findIndex(
    (item: SelectedProduct) =>
      item.productId === id &&
      item.size === (options.size ?? '') &&
      item.color === (options.color ?? ''),
  );
  if (existingItemIndex !== -1) {
    cart.products.splice(existingItemIndex, 1);
  }

  return cart;
  // return await deleteCartItem(id, {
  //   options,
  // });
};


export const clearCartAction = async (userId?: string,) => {
  const cart = await getCart(userId ?? '');
  cart.products = [];
  return cart;
  // return await clearCart();
};