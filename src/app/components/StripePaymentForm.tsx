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
  updateUserAddressAction,
} from '../actions';

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

    let isSaveAddressHandled = false;

    // If guest user, then create user
    let newUserId = userId;

    if (!newUserId) {
      if (saveAddress) {
        newUserId = await createGuestUserAction({
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
      } else {
        newUserId = await createGuestUserAction({
          email,
          phone: '',
          firstName: '',
          lastName: '',
          address: '',
          address2: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        });
      }
      isSaveAddressHandled = true;
    }

    if (!isSaveAddressHandled && saveAddress && newUserId) {
      await updateUserAddressAction({
        userId: newUserId,
        shippingInfo,
      });
    }

    // Create order
    const orderId = await createOrderAction({
      userId: newUserId,
      cart,
      deliveryMethod,
      paymentMethod: 'stripe',
      shippingInfo,
      billingInfo,
    });

    if (!orderId) {
      setLoading(false);
      alert('Error creating order');
      return;
    }

    // Create the PaymentIntent and obtain clientSecret
    const { clientSecret } = await createPaymentIntentAction({
      products: cart.validatedProducts,
      deliveryMethod,
      billingInfo,
      userId: newUserId,
      orderId,
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
      <Button type='submit' disabled={!stripe || loading}>
        Pay
      </Button>
    </form>
  );
}
