import { deleteCartItem, updateCartItem } from '@/api/cart';
import CartList from '@/app/components/CartList';
import CartSummary from '@/app/components/CartSummary';

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
    <div className='flex flex-col md:flex-row gap-2 p-8'>
      <CartList
        updateCartAction={updateCartAction}
        deleteCartAction={deleteCartAction}
      />
      <CartSummary />
    </div>
  );
}
