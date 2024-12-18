'use client';

import { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';

import { useCart, useCheckout } from '@/hooks';
import { createPaymentIntentAction } from '../actions';

import { StripePromiseContext } from '../(shop)/checkout/layout';

interface Props {
  children: React.ReactNode;
}

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

export default function StripePaymentWrapper({ children }: Readonly<Props>) {
  const cart = useCart();
  const { deliveryMethod, billingInfo } = useCheckout();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripePromise = useContext(StripePromiseContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cart?.validatedProducts.length > 0) {
        createPaymentIntentAction({
          products: cart.validatedProducts,
          deliveryMethod,
          billingInfo,
        })
          .then(({ clientSecret }) =>
            setClientSecret((prev) =>
              prev === clientSecret ? prev : clientSecret,
            ),
          )
          .catch(console.error);
      }
    }, 500); // Delay of 500ms

    return () => clearTimeout(timeout); // Cleanup
  }, [cart?.validatedProducts, deliveryMethod, billingInfo]);

  // If the clientSecret is not yet available, return null or a loading state
  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
