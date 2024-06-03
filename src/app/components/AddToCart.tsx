'use client';
import { type Cart } from '@/api/types';
import { setCart } from '@/lib/store/store';
import { useDispatch } from 'react-redux';

export default function AddToCart({
  addToCartAction,
}: {
  addToCartAction: () => Promise<Cart>;
}) {
  const dispatch = useDispatch();
  return (
    <button
      className='mt-6 px-8 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg'
      onClick={async () => {
        dispatch(setCart(await addToCartAction()));
      }}
    >
      Add To Cart
    </button>
  );
}
