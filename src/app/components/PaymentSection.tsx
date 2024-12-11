'use client';

import { Stripe } from '@stripe/stripe-js';

import StripePaymentContext from './StripePaymentContext';
import StripePaymentForm from './StripePaymentForm';

import { useCheckout } from '@/hooks';

interface Props {
  stripePromise: Promise<Stripe | null>;
}

export default function PaymentSection({ stripePromise }: Readonly<Props>) {
  const { proceedToPayment } = useCheckout();

  return (
    <section className='flex flex-col flex-nowrap gap-6 rounded-lg bg-white p-8 shadow-sm'>
      {proceedToPayment ? (
        <StripePaymentContext stripePromise={stripePromise}>
          <StripePaymentForm />
        </StripePaymentContext>
      ) : (
        <p className='text-red-500'>Fill the above fields</p>
      )}
    </section>
  );
}
