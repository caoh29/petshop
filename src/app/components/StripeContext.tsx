'use client';

import { useState, useEffect } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { createPaymentIntentAction } from '../actions';
import { convertToCurrency } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
}

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripeContext({ children }: Readonly<Props>) {
  const [clientSecret, setClientSecret] = useState<string | null>();

  useEffect(() => {
    (async () => {
      const { clientSecret } = await createPaymentIntentAction(
        convertToCurrency(20),
      );
      setClientSecret(clientSecret);
    })();
  }, []);

  if (!clientSecret) return null;

  return (
    <Elements options={{ clientSecret: clientSecret }} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
