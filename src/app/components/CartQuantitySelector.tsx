'use client';

import { Minus, Plus } from 'lucide-react';

import { useAppDispatch, useCart, useUser } from '@/hooks';

import { updateProductInCart } from '../../store/store';

import { SelectedProduct } from '@/api/types';
import { updateProductCartAction } from '@/app/actions';

interface Props {
  quantity: number;
  id: string;
  size?: string;
  color?: string;
}

export default function CartQuantitySelector({
  id,
  quantity,
  size,
  color,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const { userId, isAuthenticated } = useUser();
  const cart = useCart();

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
      const prod = cart.products.find((product) => product.productId === id);
      selectedProduct = {
        productId: id,
        productImage: prod?.productImage ?? '',
        productName: prod?.productName ?? '',
        productPrice: prod?.productPrice ?? 0,
        productCategory: prod?.productCategory ?? '',
        productSubcategory: prod?.productSubcategory ?? '',
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
