import { deleteCartItem, updateCartItem } from '@/api/cart';
import CartList from '@/app/components/CartList';

export default function CartPage() {
  const updateCartAction = async (
    id: number,
    quantity: number,
    options: {
      size?: string;
      color?: string;
    },
  ) => {
    'use server';
    return await updateCartItem(id, {
      quantity,
      options,
    });
  };

  const deleteCartAction = async (
    id: number,
    options: {
      size?: string;
      color?: string;
    },
  ) => {
    'use server';
    return await deleteCartItem(id, {
      options,
    });
  };
  return (
    <>
      <CartList
        updateCartAction={updateCartAction}
        deleteCartAction={deleteCartAction}
      />
    </>
  );
}
