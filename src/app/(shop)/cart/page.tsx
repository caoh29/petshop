import CartList from '@/app/components/CartList';
import CartSummary from '@/app/components/CartSummary';

import { updateCartAction, deleteCartAction } from '@/app/actions';

export default function CartPage() {
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
