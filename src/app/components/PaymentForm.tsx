'use client';

import { PaymentElement } from '@stripe/react-stripe-js';

export default function PaymentForm() {
  return (
    <form>
      <PaymentElement />
    </form>
  );
}
