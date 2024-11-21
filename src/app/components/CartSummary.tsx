'use client';

import Total from './Total';
import Taxes from './Taxes';
import Shipping from './Shipping';
import Subtotal from './Subtotal';

import { Separator } from './ui/separator';

import { useCart } from '../../hooks';

interface Props {
  variant?: boolean;
}

export default function CartSummary({ variant = false }: Readonly<Props>) {
  const cart = useCart();

  const subtotal = cart.products.reduce(
    (a, b) => a + b.productPrice * b.quantity,
    0,
  );
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 9.99;

  const tax = (subtotal + shipping) * 0.13;

  const total = variant ? subtotal + shipping + tax : subtotal + shipping;

  return (
    <div
      className={`flex flex-col gap-4 px-4 py-3 my-4 rounded-md ${
        !variant && 'bg-gray-100  shadow-sm'
      }`}
    >
      <div className='flex flex-col flex-nowrap gap-2'>
        <Subtotal subtotal={subtotal} variant={variant} />
        <Shipping shipping={shipping} variant={variant} />
        {variant && <Taxes tax={tax} />}
      </div>
      <Separator />
      <Total total={total} variant={variant} />
    </div>
  );
}
