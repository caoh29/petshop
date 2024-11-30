import Checkout from '@/app/components/Checkout';
// import StripeContext from '@/app/components/StripeContext';

import { auth } from '@/auth';

export default async function CheckoutPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  return (
    // <StripeContext>
    //   <Checkout userId={userId} />
    // </StripeContext>
    <Checkout userId={userId} />
  );
}
