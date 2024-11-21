// import Address from '@/app/components/Address';

import Checkout from '@/app/components/Checkout';

import { auth } from '@/auth';

export default async function CheckoutPage() {
  const session = await auth();

  return <Checkout user={session?.user} />;
}
