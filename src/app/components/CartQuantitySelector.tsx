'use client';

import { Minus, Plus } from 'lucide-react';
import { useAppDispatch, useCart } from '@/hooks';
import { updateProductInCart } from '../../store/store';
import type { SelectedProduct } from '@/api/types';
import { updateProductCartAction } from '@/app/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Props {
  quantity: number;
  id: string;
  size?: string;
  color?: string;
  userId: string | null;
}

export default function CartQuantitySelector({
  id,
  quantity,
  size,
  color,
  userId,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const cart = useCart();

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity from being less than 1

    let selectedProduct: SelectedProduct;
    if (userId) {
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
      // If the user is not authenticated, update local storage and Redux
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
    <div className='flex flex-col items-center justify-center space-y-2'>
      <Label htmlFor={`quantity-${id}`} className='text-sm font-medium'>
        Quantity
      </Label>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='icon'
          className='h-6 w-6'
          onClick={() => handleUpdateQuantity(quantity - 1)}
          disabled={quantity === 1}
        >
          <Minus className='h-3 w-3' />
          <span className='sr-only'>Decrease quantity</span>
        </Button>
        <Input
          id={`quantity-${id}`}
          type='number'
          min='1'
          readOnly
          value={quantity}
          className='h-8 w-10 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        />
        <Button
          variant='outline'
          size='icon'
          className='h-6 w-6'
          onClick={() => handleUpdateQuantity(quantity + 1)}
        >
          <Plus className='h-3 w-3' />
          <span className='sr-only'>Increase quantity</span>
        </Button>
      </div>
    </div>
  );
}
