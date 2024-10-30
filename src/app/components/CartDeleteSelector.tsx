'use client';

import { useAppDispatch, useCart, useUserAuthentication } from '@/hooks';

import { deleteProductFromCart } from '../../store/store';

interface Props {
  id: string;
  size?: string;
  color?: string;
  deleteProductCartAction: (
    id: string,
    options: { size?: string; color?: string },
    userId?: string,
  ) => Promise<number>;
}

export default function CartDeleteSelector({
  id,
  size,
  color,
  deleteProductCartAction,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const { userId, isAuthenticated } = useUserAuthentication();
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
