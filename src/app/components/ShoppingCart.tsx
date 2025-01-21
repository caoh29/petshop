import CartPopup from './CartPopup';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

import { Cart } from '@/api/types';

interface Props {
  className?: string;
  showCartPopup: boolean;
  setShowCartPopup: React.Dispatch<React.SetStateAction<boolean>>;
  cart: Cart;
}

export default function ShoppingCart({
  className,
  cart,
  showCartPopup,
  setShowCartPopup,
}: Readonly<Props>) {
  return (
    <button
      className={`${className} relative hover:cursor-pointer`}
      onClick={() => {
        setShowCartPopup(!showCartPopup);
      }}
    >
      <span className='absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-secondary text-white'>
        {cart.products.reduce((acc, product) => acc + product.quantity, 0)}
      </span>
      {showCartPopup && <CartPopup setShowCartPopup={setShowCartPopup} />}
      <ShoppingCartIcon color='#ffffff' />
    </button>
  );
}
