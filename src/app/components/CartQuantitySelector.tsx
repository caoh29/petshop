'use client';

import { useDispatch } from 'react-redux';
import { updateItemQuantity } from '@/lib/store/store';

import { Minus, Plus } from 'lucide-react';

interface Props {
  quantity: number;
  id: number;
  size?: string;
  color?: string;
}

export default function CartQuantitySelector({
  id,
  quantity,
  size,
  color,
}: Readonly<Props>) {
  const dispatch = useDispatch();

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button
        onClick={() => {
          if (quantity === 1) return;
          dispatch(
            updateItemQuantity({
              id,
              quantity: quantity - 1,
              size,
              color,
            }),
          );
        }}
      >
        <Minus />
      </button>
      <span className='mx-4'>{quantity}</span>
      <button
        onClick={() =>
          dispatch(
            updateItemQuantity({
              id,
              quantity: quantity + 1,
              size,
              color,
            }),
          )
        }
      >
        <Plus />
      </button>
    </div>
  );
}
