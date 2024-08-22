'use client';
import { type Cart } from '@/api/types';
import { RootState, setCart, resetProductState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';

export default function AddToCart({
  addToCartAction,
  disabled,
  sizes,
}: Readonly<{
  addToCartAction: (quantity: number, size: string) => Promise<Cart>;
  disabled: boolean;
  sizes: string[];
}>) {
  const dispatch = useDispatch();
  const { quantity, size, color } = useSelector(
    (state: RootState) => state.product.product,
  );
  return (
    <Button
      className={`mt-6 text-lg font-bold`}
      onClick={async () => {
        if (disabled) return;
        dispatch(setCart(await addToCartAction(quantity, size)));
        dispatch(resetProductState());
      }}
      disabled={disabled || (!size && sizes.length > 0)}
    >
      {disabled ? 'Out of Stock' : 'Add to cart'}
    </Button>
  );
}
