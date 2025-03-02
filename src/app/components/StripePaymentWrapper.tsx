'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';

import { useCart, useCheckout } from '@/hooks';
import { getAmount } from '../api/actions';
import { Stripe } from '@stripe/stripe-js';

interface Props {
  children: React.ReactNode;
  stripePromise: Promise<Stripe | null>;
  // userId: string | null;
}

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

export default function StripePaymentWrapper({
  children,
  stripePromise,
}: Readonly<Props>) {
  const cart = useCart();
  const { deliveryMethod, billingInfo } = useCheckout();
  const [amount, setAmount] = useState<number>();

  useEffect(() => {
    if (cart?.validatedProducts.length > 0) {
      getAmount(cart.validatedProducts, deliveryMethod, billingInfo)
        .then((amount) => {
          setAmount((prev) => (prev === amount ? prev : amount));
        })
        .catch(console.error);
    }
  }, [cart?.validatedProducts, deliveryMethod, billingInfo]);

  // If the clientSecret is not yet available, return null or a loading state
  if (!amount) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{ mode: 'payment', amount: amount, currency: 'cad' }}
    >
      {children}
    </Elements>
  );
}
