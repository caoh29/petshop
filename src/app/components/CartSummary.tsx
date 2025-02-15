'use client';

import { useEffect, useState } from 'react';

import Total from './Total';
import Taxes from './Taxes';
import Shipping from './Shipping';
import Subtotal from './Subtotal';

import { Separator } from './ui/separator';

import { useCart, useCheckout } from '../../hooks';
import { getCartSummaryAction } from '../api/actions';
import { Skeleton } from './ui/skeleton';

interface Props {
  isCheckout?: boolean;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function CartSummary({ isCheckout = false }: Readonly<Props>) {
  const cart = useCart();
  const { deliveryMethod, billingInfo } = useCheckout();

  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);

        const newSummary = await getCartSummaryAction({
          cart,
          isCheckout,
          deliveryMethod,
          billingInfo,
        });
        setSummary(newSummary);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart summary:', error);
      }
    };

    fetchSummary();
  }, [cart, isCheckout, deliveryMethod, billingInfo]);

  return (
    <div
      className={`flex flex-col gap-4 px-4 py-3 my-4 rounded-md ${
        !isCheckout && 'shadow-xl'
      }`}
    >
      {loading ? (
        <div className='flex flex-col flex-nowrap gap-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[250px]' />
        </div>
      ) : (
        <>
          <div className='flex flex-col flex-nowrap gap-2'>
            <Subtotal subtotal={summary.subtotal} variant={isCheckout} />
            {(!isCheckout || deliveryMethod !== 'pickup') && (
              <Shipping shipping={summary.shipping} variant={isCheckout} />
            )}
            {isCheckout && <Taxes tax={summary.tax} />}
          </div>
          <Separator />
          <Total total={summary.total} variant={isCheckout} />
        </>
      )}
    </div>
  );
}
