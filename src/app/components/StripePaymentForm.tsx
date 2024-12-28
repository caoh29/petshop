'use client';

import { useState } from 'react';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { Button } from './ui/button';

import { useCart, useCheckout } from '@/hooks';

import { createGuestUserAction, createOrderAction } from '../actions';

interface Props {
  userId: string | null;
}

export default function StripePaymentForm({ userId }: Readonly<Props>) {
  const stripe = useStripe();
  const elements = useElements();

  const cart = useCart();
  const { shippingInfo, billingInfo, email, deliveryMethod, timestamp } =
    useCheckout();

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

    // If guest user, then create user

    let newUserId = userId;

    if (!newUserId) {
      const user = await createGuestUserAction({
        email,
        phone: shippingInfo.phone,

        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        address2: shippingInfo.address2,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        country: shippingInfo.country,
      });
      newUserId = user.id;
    }

    // Create order
    const order = await createOrderAction({
      userId: newUserId,
      cart,
      deliveryMethod,
      paymentMethod: 'stripe',
      shippingInfo,
      billingInfo,
      timestamp,
    });

    if (!order) {
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment-status`,
        payment_method_data: {
          billing_details: {
            name: `${billingInfo.firstName} ${billingInfo.lastName}`,
            address: {
              country: billingInfo.country,
              line1: billingInfo.address,
              line2: billingInfo.address2 ?? '',
              city: billingInfo.city,
              state: billingInfo.state,
              postal_code: billingInfo.zip,
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
      throw new Error(error.message);
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
