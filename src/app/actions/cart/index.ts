'use server';

import { deleteCartItem, updateCartItem, addToCart, clearCart } from '@/api/cart';

export const updateCartAction = async (
  id: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
) => {
  return await updateCartItem(id, {
    quantity,
    options,
  });
};

export const deleteCartAction = async (
  id: string,
  options: {
    size?: string;
    color?: string;
  },
) => {
  return await deleteCartItem(id, {
    options,
  });
};

export const addToCartAction = async (
  id: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
) => {
  return await addToCart(id, {
    quantity,
    options,
  });
};

export const clearCartAction = async () => {
  return await clearCart();
};