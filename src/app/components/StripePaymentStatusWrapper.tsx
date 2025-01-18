'use client';

import { Elements } from '@stripe/react-stripe-js';

import { useCheckout } from '@/hooks';

interface Props {
  children: React.ReactNode;
}

export default function StripePaymentStatusWrapper({
  children,
}: Readonly<Props>) {
  const { stripePromise } = useCheckout();

  return <Elements stripe={stripePromise}>{children}</Elements>;
}
