'use client';

import { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';

import { useAppDispatch, useCart, useCheckout } from '@/hooks';
import { createPaymentIntentAction } from '../actions';

import { StripePromiseContext } from '../(shop)/checkout/layout';
import { setTimestamp } from '@/store/store';

interface Props {
  children: React.ReactNode;
  userId: string | null;
}

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

export default function StripePaymentWrapper({
  children,
  userId,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();
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
          userId,
        })
          .then(({ clientSecret, timestamp }) => {
            setClientSecret((prev) =>
              prev === clientSecret ? prev : clientSecret,
            );
            dispatch(setTimestamp(timestamp));
          })
          .catch(console.error);
      }
    }, 500); // Delay of 500ms

    return () => clearTimeout(timeout); // Cleanup
  }, [cart?.validatedProducts, deliveryMethod, billingInfo, userId, dispatch]);

  // If the clientSecret is not yet available, return null or a loading state
  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
