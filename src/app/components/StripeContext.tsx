'use client';

import { useState, useEffect, useRef } from 'react';

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
  console.log('TEST DESDE STRIPE CONTEXT');
  const cart = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>();
  const prevClientSecretRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!cart || cart.validatedProducts.length === 0) return null;
      const { clientSecret } = await createPaymentIntentAction(
        cart.validatedProducts,
      );
      if (clientSecret !== prevClientSecretRef.current) {
        prevClientSecretRef.current = clientSecret;
        setClientSecret(clientSecret);
      }
    })();
  }, [cart]);

  if (!clientSecret) return null;

  return (
    <Elements options={{ clientSecret: clientSecret }} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
