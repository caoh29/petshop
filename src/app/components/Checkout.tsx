'use client';

// import { User } from 'next-auth';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  SchemaBase,
  schemaBase,
  SchemaShip,
  schemaShip,
} from '@/lib/schemas/checkout';

import { zodResolver } from '@hookform/resolvers/zod';

import { CreditCard, Store, Truck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Separator } from '@/app/components/ui/separator';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import CartList from './CartList';
import CartSummary from './CartSummary';
// import PaymentForm from './PaymentForm';

// import { useCart } from '@/hooks';

import {
  createPaymentIntentAction,
  getUserDefaultValuesAction,
} from '../actions';

import { useCart } from '@/hooks';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
// import { convertToCurrency } from '@/lib/utils';
import StripeContext from './StripeContext';

interface Props {
  userId: string | null;
}

type SchemaCheckout = SchemaBase | (SchemaBase & SchemaShip);

// Dynamically combine schemas based on delivery method
// const createDynamicSchema = (deliveryMethod: string | undefined) => {
//   return schemaBase.extend({
//     ...(deliveryMethod === 'ship' ? schemaShip.shape : {}),
//   });
// };

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// export default function Checkout({ user }: Readonly<Props>) {
export default function Checkout({ userId }: Readonly<Props>) {
  console.log('TEST DESDE CHECKOUT');

  // const cart = useCart();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>(
    'ship',
  );

  // Initialize form with dynamic validation
  // const form = useForm<SchemaCheckout>({
  //   // resolver: zodResolver(createDynamicSchema(deliveryMethod)),
  //   resolver: zodResolver(schemaBase),
  //   defaultValues: async () => {
  //     // if (!user?.id)
  //     if (!userId)
  //       return {
  //         email: '',
  //         firstName: '',
  //         lastName: '',
  //         phone: '',
  //         deliveryMethod: 'ship',
  //         paymentMethod: 'stripe',
  //         // Shipping-specific fields
  //         address: '',
  //         address2: '',
  //         zip: '',
  //         city: '',
  //         state: '',
  //         country: '',
  //         saveAddress: false,
  //       } satisfies SchemaCheckout;

  //     // const userData = await getUserDefaultValuesAction(user.id);
  //     const userData = await getUserDefaultValuesAction(userId);
  //     return {
  //       email: userData?.email ?? '',
  //       firstName: userData?.firstName ?? '',
  //       lastName: userData?.lastName ?? '',
  //       phone: userData?.phone ?? '',
  //       address: userData?.address ?? '',
  //       address2: userData?.address2 ?? '',
  //       zip: userData?.zip ?? '',
  //       city: userData?.city ?? '',
  //       state: userData?.state ?? '',
  //       country: userData?.country ?? '',
  //       deliveryMethod: 'ship',
  //       paymentMethod: 'stripe',
  //       saveAddress: true,
  //     } satisfies SchemaCheckout;
  //   },
  //   mode: 'onChange',
  // });

  // // Watch delivery method to trigger form updates
  // const watchDeliveryMethod = form.watch('deliveryMethod');

  // // Update validation schema when delivery method changes
  // useEffect(() => {
  //   if (watchDeliveryMethod !== deliveryMethod) {
  //     setDeliveryMethod(watchDeliveryMethod);
  //     form.clearErrors();
  //   }
  // }, [watchDeliveryMethod, deliveryMethod, form]);

  const onSubmit = async (values: SchemaCheckout) => {
    setIsSubmitting(true);
    try {
      console.log(values);
    } catch (error) {
      console.error('Checkout error:', error);
      // form.setError('root', {
      //   type: 'submit',
      //   message:
      //     'Something went wrong processing your order. Please try again.',
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-200'>
      <div className='mx-auto max-w-7xl p-4 sm:px-6 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Order Summary Section */}
          <div className='rounded-lg bg-white p-8 shadow-sm lg:sticky lg:top-4'>
            <h1 className='text-2xl font-semibold'>Order Summary</h1>
            <ScrollArea className='h-[300px] p-4'>
              <CartList variant userId={userId} />
            </ScrollArea>
            <Separator className='my-4' />
            <CartSummary variant />
          </div>

          <StripeContext>
            <PaymentElement />
          </StripeContext>
        </div>
      </div>
    </div>
  );
}
