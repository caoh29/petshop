'use client';

import { useState, useEffect } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useCart } from '@/hooks';

import { createPaymentIntentAction } from '../actions';

interface Props {
  children: React.ReactNode;
}

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripeContext({ children }: Readonly<Props>) {
  const [clientSecret, setClientSecret] = useState<string | null>();
  const cart = useCart();

  useEffect(() => {
    (async () => {
      if (!cart || cart.validatedProducts.length === 0) return null;
      const { clientSecret } = await createPaymentIntentAction(
        cart.validatedProducts,
      );
      setClientSecret(clientSecret);
    })();
  }, [cart]);

  if (!clientSecret) return null;

  return (
    <Elements options={{ clientSecret: clientSecret }} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
