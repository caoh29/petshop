'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCart, resetProductState } from '@/lib/store/store';

import { Product, type Cart } from '@/api/types';

import { Button } from './ui/button';

export default function AddToCart({
  addToCartAction,
  disabled,
  product,
}: Readonly<{
  addToCartAction: (
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
  disabled: boolean;
  product: Product;
}>) {
  const dispatch = useDispatch();
  const { quantity, size, color } = useSelector(
    (state: RootState) => state.selectedProduct.selectedProduct,
  );
  return (
    <Button
      className={`mt-6 text-lg font-bold`}
      onClick={async () => {
        if (disabled) return;
        dispatch(
          setCart(
            await addToCartAction(quantity, {
              size,
              color,
            }),
          ),
        );
        dispatch(resetProductState());
      }}
      disabled={
        disabled ||
        (!size && product.sizes && product.sizes.length > 0) ||
        (!color && product.colors && product.colors.length > 0)
      }
    >
      {disabled ? 'Out of Stock' : 'Add to cart'}
    </Button>
  );
}
