'use client';

import StripePaymentWrapper from './StripePaymentWrapper';
import StripePaymentForm from './StripePaymentForm';

import { useCheckout } from '@/hooks';
import { Stripe } from '@stripe/stripe-js';

interface Props {
  userId: string | null;
  stripePromise: Promise<Stripe | null>;
}

export default function PaymentSection({
  userId,
  stripePromise,
}: Readonly<Props>) {
  const { proceedToPayment } = useCheckout();

  return (
    <section className='flex flex-col flex-nowrap gap-6 rounded-lg bg-white p-8 shadow-sm'>
      {proceedToPayment ? (
        <StripePaymentWrapper stripePromise={stripePromise}>
          <StripePaymentForm userId={userId} />
        </StripePaymentWrapper>
      ) : (
        <p className='text-red-500'>Fill the above fields</p>
      )}
    </section>
  );
}
