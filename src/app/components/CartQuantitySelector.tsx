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

    let selectedProduct: SelectedProduct;
    if (isAuthenticated) {
      // Update the cart on the server for authenticated users
      selectedProduct = await updateProductCartAction(
        id,
        newQuantity,
        {
          size,
          color,
        },
        userId,
      );
    } else {
      // // If the user is not authenticated, update local storage and Redux
      selectedProduct = {
        productId: id,
        productImage: '',
        productName: '',
        productPrice: 0,
        productCategory: '',
        productSubcategory: '',
        size,
        color,
        quantity: newQuantity,
      };
    }
    dispatch(updateProductInCart(selectedProduct));
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
