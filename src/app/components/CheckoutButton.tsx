'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from './ui/button';

import { useAppDispatch, useCart } from '../../hooks';
// import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

import { validateStockAction, reserveStockAction } from '../actions';

import { setValidatedProducts } from '@/store/store';

interface Props {
  userId: string | null;
}

export default function CheckoutButton({ userId }: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const cart = useCart();

  const router = useRouter();

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
    <>
      {userId ? (
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
    </>
  );
}
