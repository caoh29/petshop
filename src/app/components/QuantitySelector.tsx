'use client';

import { useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  setQuantity,
  increaseQuantity,
  decreaseQuantity,
  RootState,
} from '@/lib/store/store';

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector() {
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(setQuantity(1));
    initialized.current = true;
  }
  const dispatch = useDispatch();
  const quantity = useSelector(
    (state: RootState) => state.product.product.quantity,
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
