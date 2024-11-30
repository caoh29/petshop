'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useCart } from '@/hooks';
import { createPaymentIntentAction } from '../actions';

interface Props {
  children: React.ReactNode;
}

// Load Stripe outside the component to prevent recreation on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripeContext({ children }: Props) {
  console.log('TEST FROM STRIPE CONTEXT');
  const cart = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // useEffect(() => {
  //   // Only create a payment intent if the cart has validated products
  //   const fetchPaymentIntent = async () => {
  //     if (cart?.validatedProducts.length > 0) {
  //       const { clientSecret } = await createPaymentIntentAction(
  //         cart.validatedProducts,
  //       );
  //       setClientSecret(clientSecret);
  //     }
  //   };

  //   fetchPaymentIntent();
  // }, [cart]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cart?.validatedProducts.length > 0) {
        createPaymentIntentAction(cart.validatedProducts)
          .then(({ clientSecret }) =>
            setClientSecret((prev) =>
              prev === clientSecret ? prev : clientSecret,
            ),
          )
          .catch(console.error);
      }
    }, 500); // Delay of 500ms

    return () => clearTimeout(timeout); // Cleanup
  }, [cart?.validatedProducts]);

  // If the clientSecret is not yet available, return null or a loading state
  if (!clientSecret) return null;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
