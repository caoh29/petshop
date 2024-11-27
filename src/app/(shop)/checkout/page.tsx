import Checkout from '@/app/components/Checkout';
import StripeContext from '@/app/components/StripeContext';

import { auth } from '@/auth';

export default async function CheckoutPage() {
  const session = await auth();

  return (
    <StripeContext>
      <Checkout user={session?.user} />{' '}
    </StripeContext>
  );
}
