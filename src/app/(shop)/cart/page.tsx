import CartList from '@/app/components/CartList';
import CartSummary from '@/app/components/CartSummary';

import {
  updateProductCartAction,
  deleteProductCartAction,
} from '@/app/actions';

export default function CartPage() {
  return (
    <div className='flex flex-col md:flex-row gap-2 p-8'>
      <CartList
        updateProductCartAction={updateProductCartAction}
        deleteProductCartAction={deleteProductCartAction}
      />
      <CartSummary />
    </div>
  );
}
