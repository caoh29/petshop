'use client';

import { useDispatch } from 'react-redux';

import { Minus, Plus } from 'lucide-react';
import { setCart } from '../../store/store';
import { Cart } from '@/api/types';

interface Props {
  quantity: number;
  id: string;
  size?: string;
  color?: string;
  updateCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
}

export default function CartQuantitySelector({
  id,
  quantity,
  size,
  color,
  updateCartAction,
}: Readonly<Props>) {
  const dispatch = useDispatch();

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button
        onClick={async () => {
          if (quantity === 1) return;
          quantity -= 1;
          dispatch(
            setCart(
              await updateCartAction(id, quantity, {
                size,
                color,
              }),
            ),
          );
        }}
      >
        <Minus />
      </button>
      <span className='mx-4'>{quantity}</span>
      <button
        onClick={async () => {
          quantity += 1;
          dispatch(
            setCart(
              await updateCartAction(id, quantity, {
                size,
                color,
              }),
            ),
          );
        }}
      >
        <Plus />
      </button>
    </div>
  );
}
