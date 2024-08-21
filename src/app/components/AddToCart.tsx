'use client';
import { type Cart } from '@/api/types';
import { RootState, setCart, resetProductState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';

export default function AddToCart({
  addToCartAction,
  disabled,
}: {
  addToCartAction: (size: string, quantity: number) => Promise<Cart>;
  disabled: boolean;
}) {
  const dispatch = useDispatch();
  const { size, quantity } = useSelector(
    (state: RootState) => state.product.product,
  );
  return (
    <Button
      className={`mt-6 text-lg font-bold`}
      onClick={async () => {
        if (disabled) return;
        dispatch(setCart(await addToCartAction(size, quantity)));
        dispatch(resetProductState());
      }}
      disabled={disabled}
    >
      {disabled ? 'Out of Stock' : 'Add to cart'}
    </Button>
  );
}
