'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCart, resetProductState } from '../../store/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Product, type Cart } from '@/api/types';

import { Button } from './ui/button';

export default function AddToCart({
  addToCartAction,
  disabled,
  product,
}: Readonly<{
  addToCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
  disabled: boolean;
  product: Product;
}>) {
  const dispatch = useDispatch();
  // const { quantity, size, color } = useSelector(
  //   (state: RootState) => state.selectedProduct.selectedProduct,
  // );
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const size = searchParams.get('Size') ?? '';
  const color = searchParams.get('Color') ?? '';
  const quantity = Number(searchParams.get('Quantity'));

  const updateSearchParams = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('Size');
    newParams.delete('Quantity');
    newParams.delete('Color');
    router.push(`/${params.category}/${params.subcategory}/${params.id}`);
  };

  return (
    <Button
      className={`mt-6 text-lg font-bold`}
      onClick={async () => {
        if (disabled) return;
        if (quantity === 0) {
          dispatch(
            setCart(
              await addToCartAction(product.id, 1, {
                size,
                color,
              }),
            ),
          );
        } else {
          dispatch(
            setCart(
              await addToCartAction(product.id, quantity, {
                size,
                color,
              }),
            ),
          );
        }
        updateSearchParams();
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
