'use client';

import { useDispatch } from 'react-redux';
import { updateItemQuantity } from '@/lib/store/store';

import { Minus, Plus } from 'lucide-react';

interface Props {
  quantity: number;
  id: number;
}

export default function CartQuantitySelector({
  id,
  quantity,
}: Readonly<Props>) {
  const dispatch = useDispatch();

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button
        onClick={() =>
          dispatch(
            updateItemQuantity({
              id,
              quantity: quantity - 1,
            }),
          )
        }
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
            }),
          )
        }
      >
        <Plus />
      </button>
    </div>
  );
}
