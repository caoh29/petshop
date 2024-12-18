import StripePaymentStatus from '@/app/components/StripePaymentStatus';
import StripePaymentStatusWrapper from '@/app/components/StripePaymentStatusWrapper';

export default function PaymentStatusPage() {
  return (
    <StripePaymentStatusWrapper>
      <StripePaymentStatus />
    </StripePaymentStatusWrapper>
  );
}
