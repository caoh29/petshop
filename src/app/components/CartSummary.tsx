'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Total from './Total';
// import Taxes from './Taxes';
import Shipping from './Shipping';
import Subtotal from './Subtotal';
import { Button } from './ui/button';

import { useAppDispatch, useCart, useUser } from '../../hooks';
// import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

import { validateStockAction, reserveStockAction } from '../actions';

import { setValidatedProducts } from '@/store/store';
// import { Separator } from './ui/separator';

export default function CartSummary() {
  const dispatch = useAppDispatch();
  const cart = useCart();
  const { isAuthenticated } = useUser();

  const router = useRouter();

  const subtotal = cart.products.reduce(
    (a, b) => a + b.productPrice * b.quantity,
    0,
  );
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 9.99;

  const total = subtotal + shipping;

  const handleClick = async () => {
    const validatedProducts = await validateStockAction(cart.products);
    // This will tell the UI to mark red the items that are out of stock or needs to be reduce
    dispatch(setValidatedProducts(validatedProducts));

    if (validatedProducts.some((product) => product.isAvailable === false)) {
      return;
    }

    const isReserved = await reserveStockAction(cart.products);
    if (
      isReserved.productsUpdated === validatedProducts.length &&
      !validatedProducts.some((product) => product.isAvailable === false)
    ) {
      router.push('/checkout');
    }
  };

  return (
    <div className='container flex flex-col flex-nowrap gap-4'>
      <h1 className='text-2xl font-bold mb-4'>Summary</h1>
      <div className='flex flex-col gap-4 bg-gray-100 px-4 py-3 my-4 rounded-md shadow-sm'>
        <div className='flex flex-col flex-nowrap gap-2'>
          <Subtotal subtotal={subtotal} />
          <Shipping shipping={shipping} />
        </div>
        {/* <Separator /> */}
        <div className='border-t-2 border-slate-400 border-solid pb-2 pt-6'>
          <Total total={total} />
        </div>
      </div>

      {isAuthenticated ? (
        <Button className='w-full' onClick={handleClick}>
          Checkout
        </Button>
      ) : (
        <>
          <Button className='w-full' onClick={handleClick}>
            Guest Checkout
          </Button>

          <Link href={'/auth/signin'}>
            <Button className='w-full'>Member Checkout</Button>
          </Link>
        </>
      )}
      <Button>PayPal</Button>
    </div>
  );
}
