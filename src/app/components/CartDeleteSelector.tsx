'use client';

import { useAppDispatch } from '@/hooks';

import { deleteProductFromCart } from '../../store/store';

import { deleteProductCartAction } from '@/app/actions';

interface Props {
  id: string;
  size?: string;
  color?: string;
  userId: string | null;
}

export default function CartDeleteSelector({
  id,
  size,
  color,
  userId,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
  // const cart = useCart();

  const handleDelete = async () => {
    if (userId) {
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
