import StripePaymentStatus from '@/app/components/StripePaymentStatus';
import StripePaymentStatusWrapper from '@/app/components/StripePaymentStatusWrapper';

export default function PaymentStatusPage() {
  return (
    <main className='bg-gray-50 min-h-screen'>
      <StripePaymentStatusWrapper>
        <StripePaymentStatus />
      </StripePaymentStatusWrapper>
    </main>
  );
}
