'use client';

// import { User } from 'next-auth';

import { useState, useEffect, useRef } from 'react';
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

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { convertToCurrency } from '@/lib/utils';
// import StripeContext from './StripeContext';

interface Props {
  userId: string | null;
}

type SchemaCheckout = SchemaBase | (SchemaBase & SchemaShip);

// Dynamically combine schemas based on delivery method
const createDynamicSchema = (deliveryMethod: string | undefined) => {
  return schemaBase.extend({
    ...(deliveryMethod === 'ship' ? schemaShip.shape : {}),
  });
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// export default function Checkout({ user }: Readonly<Props>) {
export default function Checkout({ userId }: Readonly<Props>) {
  console.log('TEST DESDE CHECKOUT');

  const cart = useCart();

  const [clientSecret, setClientSecret] = useState<string | null>();
  const prevClientSecretRef = useRef<string | null>(null);

  const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>(
    'ship',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!cart || cart.validatedProducts.length === 0) return null;
      const { clientSecret } = await createPaymentIntentAction(
        cart.validatedProducts,
      );
      if (clientSecret !== prevClientSecretRef.current) {
        prevClientSecretRef.current = clientSecret;
        setClientSecret(clientSecret);
      }
    })();
  }, [cart]);

  // Initialize form with dynamic validation
  const form = useForm<SchemaCheckout>({
    resolver: zodResolver(createDynamicSchema(deliveryMethod)),
    defaultValues: async () => {
      // if (!user?.id)
      if (!userId)
        return {
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          deliveryMethod: 'ship',
          paymentMethod: 'stripe',
          // Shipping-specific fields
          address: '',
          address2: '',
          zip: '',
          city: '',
          state: '',
          country: '',
          saveAddress: false,
        } satisfies SchemaCheckout;

      // const userData = await getUserDefaultValuesAction(user.id);
      const userData = await getUserDefaultValuesAction(userId);
      return {
        email: userData?.email ?? '',
        firstName: userData?.firstName ?? '',
        lastName: userData?.lastName ?? '',
        phone: userData?.phone ?? '',
        address: userData?.address ?? '',
        address2: userData?.address2 ?? '',
        zip: userData?.zip ?? '',
        city: userData?.city ?? '',
        state: userData?.state ?? '',
        country: userData?.country ?? '',
        deliveryMethod: 'ship',
        paymentMethod: 'stripe',
        saveAddress: true,
      } satisfies SchemaCheckout;
    },
    mode: 'onChange',
  });

  // Watch delivery method to trigger form updates
  const watchDeliveryMethod = form.watch('deliveryMethod');

  // Update validation schema when delivery method changes
  useEffect(() => {
    if (watchDeliveryMethod !== deliveryMethod) {
      setDeliveryMethod(watchDeliveryMethod);
      form.clearErrors();
    }
  }, [watchDeliveryMethod, deliveryMethod, form]);

  const onSubmit = async (values: SchemaCheckout) => {
    setIsSubmitting(true);
    try {
      console.log(values);
    } catch (error) {
      console.error('Checkout error:', error);
      form.setError('root', {
        type: 'submit',
        message:
          'Something went wrong processing your order. Please try again.',
      });
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

          {/* Checkout Form Section */}
          <div className='rounded-lg bg-white p-8 shadow-sm'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                {/* Contact Information */}
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold'>Contact Information</h2>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Delivery Method Selection */}
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold'>Delivery Method</h2>
                  <FormField
                    control={form.control}
                    name='deliveryMethod'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='grid gap-4'
                          >
                            <div className='flex items-center space-x-2 rounded-lg border p-4'>
                              <RadioGroupItem value='ship' id='ship' />
                              <FormLabel
                                htmlFor='ship'
                                className='flex items-center gap-2'
                              >
                                <Truck className='h-4 w-4' />
                                Ship to Address
                              </FormLabel>
                            </div>
                            <div className='flex items-center space-x-2 rounded-lg border p-4'>
                              <RadioGroupItem value='pickup' id='pickup' />
                              <FormLabel
                                htmlFor='pickup'
                                className='flex items-center gap-2'
                              >
                                <Store className='h-4 w-4' />
                                Store Pickup
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {watchDeliveryMethod && (
                  <>
                    <Separator />
                    {/* Personal Information */}
                    <div className='space-y-4'>
                      <h2 className='text-xl font-semibold'>
                        {watchDeliveryMethod === 'pickup'
                          ? 'Pickup'
                          : 'Shipping'}{' '}
                        Information
                      </h2>
                      <div className='grid gap-4 sm:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='firstName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='lastName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Shipping Address Fields */}
                      {watchDeliveryMethod === 'ship' && (
                        <div className='space-y-4'>
                          <FormField
                            control={form.control}
                            name='address'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='address2'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 2 (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className='grid gap-4 sm:grid-cols-2'>
                            <FormField
                              control={form.control}
                              name='city'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='zip'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className='grid gap-4 sm:grid-cols-2'>
                            <FormField
                              control={form.control}
                              name='state'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State/Province</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='country'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name='saveAddress'
                            render={({ field }) => (
                              <FormItem className='flex flex-nowrap items-center gap-2'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className='text-sm'>
                                  Save address for future orders
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                {/* Payment Section */}
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold'>Payment</h2>
                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='grid gap-4'
                          >
                            {form.watch('paymentMethod') !== 'stripe' && (
                              <div className='flex items-center space-x-2 rounded-lg border p-4'>
                                <RadioGroupItem value='stripe' id='stripe' />
                                <FormLabel
                                  htmlFor='stripe'
                                  className='flex items-center gap-2'
                                >
                                  <CreditCard className='h-4 w-4' />
                                  Card
                                </FormLabel>
                              </div>
                            )}
                            {form.watch('paymentMethod') === 'stripe' &&
                              clientSecret && (
                                <Elements
                                  options={{
                                    clientSecret: clientSecret,
                                  }}
                                  stripe={stripePromise}
                                >
                                  <PaymentElement
                                    options={{
                                      layout: 'accordion',
                                    }}
                                  />
                                </Elements>
                              )}
                            <div className='flex items-center space-x-2 rounded-lg border p-4'>
                              <RadioGroupItem value='paypal' id='paypal' />
                              <FormLabel
                                htmlFor='paypal'
                                className='flex items-center gap-2'
                              >
                                PayPal
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Submit Button */}
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting || !watchDeliveryMethod}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
