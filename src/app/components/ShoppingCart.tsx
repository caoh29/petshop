import CartPopup from './CartPopup';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

import { Cart } from '@/api/types';

interface Props {
  showCartPopup: boolean;
  setShowCartPopup: React.Dispatch<React.SetStateAction<boolean>>;
  cart: Cart;
}

export default function ShoppingCart({
  cart,
  showCartPopup,
  setShowCartPopup,
}: Props) {
  return (
    <button
      className='relative order-4'
      onClick={() => {
        setShowCartPopup(!showCartPopup);
      }}
    >
      <span className='absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white'>
        {cart.products.reduce((acc, product) => acc + product.quantity, 0)}
      </span>
      {showCartPopup && <CartPopup setShowCartPopup={setShowCartPopup} />}
      <ShoppingCartIcon color='#ffffff' />
    </button>
  );
}
