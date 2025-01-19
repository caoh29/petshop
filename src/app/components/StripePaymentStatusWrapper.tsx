'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

interface Props {
  children: React.ReactNode;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripePaymentStatusWrapper({
  children,
}: Readonly<Props>) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
