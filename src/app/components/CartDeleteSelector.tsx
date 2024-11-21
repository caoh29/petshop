'use client';

import { useAppDispatch, useCart, useUser } from '@/hooks';

import { deleteProductFromCart } from '../../store/store';

import { deleteProductCartAction } from '@/app/actions';

interface Props {
  id: string;
  size?: string;
  color?: string;
}

export default function CartDeleteSelector({
  id,
  size,
  color,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const { userId, isAuthenticated } = useUser();
  // const cart = useCart();

  const handleDelete = async () => {
    if (isAuthenticated) {
      // Update the cart on the server for authenticated users
      await deleteProductCartAction(
        id,
        {
          size: size ?? '',
          color: color ?? '',
        },
        userId,
      );
    }

    dispatch(
      deleteProductFromCart({
        productId: id,
        size: size ?? '',
        color: color ?? '',
      }),
    );
  };

  return (
    <button className='text-red-500' onClick={() => handleDelete()}>
      Remove
    </button>
  );
}
