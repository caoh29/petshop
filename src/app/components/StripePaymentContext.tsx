'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';

import { useCart, useCheckout } from '@/hooks';
import { createPaymentIntentAction } from '../actions';

interface Props {
  children: React.ReactNode;
  stripePromise: Promise<Stripe | null>;
}

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

export default function StripePaymentContext({
  children,
  stripePromise,
}: Readonly<Props>) {
  const cart = useCart();
  const {
    deliveryMethod,
    billingInfo: { zip, country },
  } = useCheckout();
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
        createPaymentIntentAction({
          products: cart.validatedProducts,
          deliveryMethod,
          zip,
          country,
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
  }, [cart?.validatedProducts, deliveryMethod, zip, country]);

  // If the clientSecret is not yet available, return null or a loading state
  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
