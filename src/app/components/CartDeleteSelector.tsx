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
    } else {
      // // Update the cart in localStorage for non-authenticated users
      // localStorage.setItem(
      //   'cart',
      //   JSON.stringify(
      //     cart.products.filter(
      //       (product) =>
      //         product.productId !== item.productId &&
      //         product.size !== item.size &&
      //         product.color !== item.color,
      //     ),
      //   ),
      // );
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
