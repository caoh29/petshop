'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createContext } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export const StripePromiseContext =
  createContext<Promise<Stripe | null>>(stripePromise);

interface Props {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children }: Readonly<Props>) {
  return (
    <StripePromiseContext.Provider value={stripePromise}>
      {children}
    </StripePromiseContext.Provider>
  );
}
