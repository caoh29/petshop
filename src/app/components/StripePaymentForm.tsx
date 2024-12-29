'use client';

import { useState } from 'react';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { Button } from './ui/button';

import { useCart, useCheckout } from '@/hooks';

import {
  createGuestUserAction,
  createOrderAction,
  createPaymentIntentAction,
} from '../actions';

interface Props {
  userId: string | null;
}

export default function StripePaymentForm({ userId }: Readonly<Props>) {
  const cart = useCart();
  const { shippingInfo, billingInfo, email, deliveryMethod, timestamp } =
    useCheckout();

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (error: any) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    // if (!stripe || !elements) {
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
    });

    if (!order) {
      setLoading(false);
      setErrorMessage('Error creating order');
      return;
    }

    // Create the PaymentIntent and obtain clientSecret
    const { clientSecret } = await createPaymentIntentAction({
      products: cart.validatedProducts,
      deliveryMethod,
      billingInfo,
      userId: newUserId,
      orderId: order.id,
    });

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
      <Button type='submit' disabled={!stripe || loading}>
        Pay
      </Button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
