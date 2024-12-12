'use client';

import { useEffect, useState } from 'react';

import Total from './Total';
import Taxes from './Taxes';
import Shipping from './Shipping';
import Subtotal from './Subtotal';

import { Separator } from './ui/separator';

import { useCart, useCheckout } from '../../hooks';
import { getCartSummaryAction } from '../actions';

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
  const {
    deliveryMethod,
    billingInfo: { zip, country },
  } = useCheckout();

  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const newSummary = await getCartSummaryAction({
          cart,
          isCheckout,
          deliveryMethod,
          zip: isCheckout ? zip : undefined,
          country: isCheckout ? country : undefined,
        });
        setSummary(newSummary);
      } catch (error) {
        console.error('Error fetching cart summary:', error);
      }
    };

    fetchSummary();
  }, [cart, isCheckout, deliveryMethod, zip, country]);

  return (
    <div
      className={`flex flex-col gap-4 px-4 py-3 my-4 rounded-md ${
        !isCheckout && 'bg-gray-100 shadow-sm'
      }`}
    >
      <div className='flex flex-col flex-nowrap gap-2'>
        <Subtotal subtotal={summary.subtotal} variant={isCheckout} />
        {(!isCheckout || (isCheckout && summary.shipping > 0)) && (
          <Shipping shipping={summary.shipping} variant={isCheckout} />
        )}
        {isCheckout && <Taxes tax={summary.tax} />}
      </div>
      <Separator />
      <Total total={summary.total} variant={isCheckout} />
    </div>
  );
}
