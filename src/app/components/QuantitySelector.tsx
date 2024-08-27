'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  RootState,
} from '@/lib/store/store';

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector() {
  const dispatch = useDispatch();
  const quantity = useSelector(
    (state: RootState) => state.selectedProduct.selectedProduct.quantity,
  );

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button onClick={() => dispatch(decreaseQuantity())}>
        <Minus />
      </button>
      <span className='mx-4'>{quantity}</span>
      <button onClick={() => dispatch(increaseQuantity())}>
        <Plus />
      </button>
    </div>
  );
}
