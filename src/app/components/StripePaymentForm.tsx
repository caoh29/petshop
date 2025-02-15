'use client';

import { useState } from 'react';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { Button } from './ui/button';

import { useCart, useCheckout } from '@/hooks';

import { createOrderAction, createPaymentIntentAction } from '../api/actions';

interface Props {
  userId: string | null;
}

export default function StripePaymentForm({ userId }: Readonly<Props>) {
  const cart = useCart();
  const { shippingInfo, billingInfo, email, deliveryMethod, saveAddress } =
    useCheckout();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (error: any) => {
    setLoading(false);
  };

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create order
    const order = await createOrderAction({
      userId,
      cart,
      deliveryMethod,
      email,
      paymentMethod: 'stripe',
      shippingInfo,
      billingInfo,
      saveAddress,
    });

    if (!order) {
      setLoading(false);
      alert('Error creating order');
      return;
    }

    // Create the PaymentIntent and obtain clientSecret
    const { clientSecret } = await createPaymentIntentAction({
      products: cart.validatedProducts,
      deliveryMethod,
      billingInfo,
      userId: order.userId,
      orderId: order.id,
      email,
    });

    // Confirm payment with stripe
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
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
      handleError(error);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
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
      <Button className='mt-4' type='submit' disabled={!stripe || loading}>
        Pay
      </Button>
    </form>
  );
}
