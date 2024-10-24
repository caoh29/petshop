'use client';

import { Minus, Plus } from 'lucide-react';

import { useAppDispatch, useCart, useUserAuthentication } from '@/hooks';

import { updateProductInCart } from '../../store/store';

import { SelectedProduct } from '@/api/types';

interface Props {
  quantity: number;
  id: string;
  size?: string;
  color?: string;
  updateProductCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
    userId?: string,
  ) => Promise<SelectedProduct>;
}

export default function CartQuantitySelector({
  id,
  quantity,
  size,
  color,
  updateProductCartAction,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const { userId, isAuthenticated } = useUserAuthentication();
  // const cart = useCart();

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity from being less than 1

    if (isAuthenticated) {
      // Update the cart on the server for authenticated users
      dispatch(
        updateProductInCart(
          await updateProductCartAction(
            id,
            newQuantity,
            {
              size,
              color,
            },
            userId,
          ),
        ),
      );
    } else {
      // // Update the cart in localStorage for non-authenticated users
      // const updatedCart = {
      //   ...cart,
      //   products: cart.products.map((product) =>
      //     product.productId === id &&
      //     product.size === (size ?? '') &&
      //     product.color === (color ?? '')
      //       ? { ...product, quantity: newQuantity }
      //       : product,
      //   ),
      // };
      // // Save updated cart to localStorage and update Redux state
      // localStorage.setItem('cart', JSON.stringify(updatedCart));
      // dispatch(
      //   updateProductInCart({
      //     productId: id,
      //     productImage: '',
      //     productName: '',
      //     productPrice: 0,
      //     productCategory: '',
      //     productSubcategory: '',
      //     size,
      //     color,
      //     quantity: newQuantity,
      //   }),
      // );
    }
  };

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button
        onClick={() => handleUpdateQuantity(quantity - 1)}
        disabled={quantity === 1}
      >
        <Minus />
      </button>
      <span className='mx-4'>{quantity}</span>
      <button onClick={() => handleUpdateQuantity(quantity + 1)}>
        <Plus />
      </button>
    </div>
  );
}
