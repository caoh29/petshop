'use client';

import { useState } from 'react';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { Button } from './ui/button';

interface Props {
  billingInfo: {
    firstName: string;
    lastName: string;
    country: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export default function StripePaymentForm({
  billingInfo: {
    firstName,
    lastName,
    country,
    address,
    address2,
    city,
    state,
    zip,
  },
}: Readonly<Props>) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment-status`,
        payment_method_data: {
          billing_details: {
            name: `${firstName} ${lastName}`,
            address: {
              country,
              line1: address,
              line2: address2 ?? '',
              city,
              state,
              postal_code: zip,
            },
          },
        },
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message ?? null);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          fields: {
            billingDetails: {
              address: 'never',
            },
          },
        }}
      />
      <Button type='submit' disabled={!stripe || loading}>
        Pay
      </Button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}