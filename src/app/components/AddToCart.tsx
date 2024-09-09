'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCart, resetProductState } from '../../store/store';

import { Product, type Cart } from '@/api/types';

import { Button } from './ui/button';

export default function AddToCart({
  addToCartAction,
  disabled,
  productId,
  sizes,
  colors,
}: Readonly<{
  addToCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
  disabled: boolean;
  productId: string;
  sizes?: string[];
  colors?: string[];
}>) {
  const dispatch = useDispatch();
  const { quantity, size, color } = useSelector(
    (state: RootState) => state.selectedProduct.selectedProduct,
  );

  const handleClick = async () => {
    if (disabled) return;
    dispatch(
      setCart(
        await addToCartAction(productId, quantity, {
          size,
          color,
        }),
      ),
    );
    dispatch(resetProductState());
  };

  return (
    <Button
      className={`mt-6 text-lg font-bold`}
      onClick={handleClick}
      disabled={
        disabled ||
        (!size && sizes && sizes.length > 0) ||
        (!color && colors && colors.length > 0)
      }
    >
      {disabled ? 'Unavailable' : 'Add to cart'}
    </Button>
  );
}
