import { auth } from '@/auth';

import { Separator } from '@/app/components/ui/separator';
import { ScrollArea } from '@/app/components/ui/scroll-area';

import CartList from '@/app/components/CartList';
import CartSummary from '@/app/components/CartSummary';
import CheckoutSection from '@/app/components/CheckoutSection';
import { getUserDefaultValuesAction } from '@/app/api/actions';

export type UserData =
  | {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      address2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      phone: string;
    }
  | null
  | undefined;

export default async function CheckoutPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  let userData: UserData = null;
  if (userId !== null) {
    userData = await getUserDefaultValuesAction(userId);
  }

  return (
    <div className='flex flex-col gap-8 md:grid md:grid-cols-2 md:min-h-[calc(70dvh-5rem)]'>
      <div className='rounded-lg p-4 bg-accent sm:p-8 shadow-lg lg:sticky lg:top-4'>
        <h1 className='text-2xl font-semibold'>Order Summary</h1>
        <ScrollArea className='h-[300px] p-4'>
          <CartList userId={userId} variant />
        </ScrollArea>
        <Separator className='my-4' />
        <CartSummary isCheckout />
      </div>
      {/* Checkout Section */}
      <div className='flex flex-col flex-nowrap gap-8 rounded-lg bg-accent p-8 shadow-lg'>
        <CheckoutSection userData={userData} userId={userId} />
      </div>
    </div>
  );
}
