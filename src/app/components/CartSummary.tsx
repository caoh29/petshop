'use client';

import Total from './Total';
import Taxes from './Taxes';
import Shipping from './Shipping';
import Subtotal from './Subtotal';
import { Button } from './ui/button';

import { useCart } from '../../hooks';
// import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function CartSummary() {
  const cart = useCart();

  const subtotal = cart.products.reduce(
    (a, b) => a + b.productPrice * b.quantity,
    0,
  );
  const tax = subtotal * 0.13;
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 9.99;

  const total = subtotal + tax + shipping;

  return (
    <div className='container flex flex-col flex-nowrap gap-4'>
      <h1 className='text-2xl font-bold mb-4'>Summary</h1>
      <div>
        <div className='flex flex-col flex-nowrap border-b-2 border-slate-400 border-solid'>
          <Subtotal subtotal={subtotal} />
          <Shipping shipping={shipping} />
          <Taxes tax={tax} />
        </div>
        <div className='border-b-2 border-slate-400 border-solid'>
          <Total total={total} />
        </div>
      </div>
      {/* <SignedOut>
        <Link href={'/checkout'}>
          <Button className='w-full'>Guest Checkout</Button>
        </Link>
        <SignInButton>
          <Button>Member Checkout</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link href={'/checkout'}>
          <Button className='w-full'>Checkout</Button>
        </Link>
      </SignedIn> */}
      <Button className='w-full'>Guest Checkout</Button>
      <Button>Member Checkout</Button>
      <Button>PayPal</Button>
    </div>
  );
}
