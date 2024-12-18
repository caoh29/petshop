'use client';

import { useContext } from 'react';

import { Elements } from '@stripe/react-stripe-js';

import { StripePromiseContext } from '../(shop)/checkout/layout';

interface Props {
  children: React.ReactNode;
}

export default function StripePaymentStatusWrapper({
  children,
}: Readonly<Props>) {
  const stripePromise = useContext(StripePromiseContext);
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
