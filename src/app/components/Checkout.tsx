'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  schemaCheckout,
  SchemaCheckout,
  defaultValues,
} from '@/lib/schemas/checkout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CreditCard, Store, Truck } from 'lucide-react';

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
import { useUser } from '@/hooks';

export default function Checkout() {
  const user = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDefaultValues = async (userId: string) => {
    if (userId.length === 0) return defaultValues;
    return await getUserDefaultValuesAction(userId);
  };

  const form = useForm<SchemaCheckout>({
    resolver: zodResolver(schemaCheckout),
    defaultValues: getDefaultValues(user.userId),
  });

  async function onSubmit(values: SchemaCheckout) {
    setIsSubmitting(true);
    try {
      // Here you would integrate with your payment provider
      console.log(values);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='min-h-screen bg-gray-200'>
      <div className='mx-auto max-w-7xl p-4 sm:px-6 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Order Summary */}
          <div className='rounded-lg bg-white p-8 shadow-sm lg:sticky lg:top-4'>
            <h2 className='text-lg font-semibold'>Order Summary</h2>
            <ScrollArea className='h-[300px] py-4'>
              <div className='space-y-4'>
                {/* Example order items - replace with your actual cart items */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='h-16 w-16 rounded-md bg-gray-100' />
                    <div>
                      <p className='font-medium'>Product Name</p>
                      <p className='text-sm text-gray-500'>Quantity: 1</p>
                    </div>
                  </div>
                  <p className='font-medium'>$99.00</p>
                </div>
              </div>
            </ScrollArea>
            <Separator className='my-4' />
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <p>Subtotal</p>
                <p className='font-medium'>$99.00</p>
              </div>
              <div className='flex justify-between'>
                <p>Shipping</p>
                <p className='font-medium'>$9.99</p>
              </div>
              <div className='flex justify-between'>
                <p>Tax</p>
                <p className='font-medium'>$10.99</p>
              </div>
              <Separator />
              <div className='flex justify-between text-lg font-semibold'>
                <p>Total</p>
                <p>$119.98</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className='rounded-lg bg-white p-8 shadow-sm'>
            <h1 className='text-2xl font-semibold'>Delivery</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mt-6 space-y-6'
              >
                <FormField
                  control={form.control}
                  name='deliveryMethod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='grid gap-4'
                        >
                          <div className='flex items-center space-x-2 rounded-lg border p-4'>
                            <RadioGroupItem value='ship' id='ship' />
                            <FormLabel
                              htmlFor='ship'
                              className='flex items-center gap-2'
                            >
                              <Truck className='h-4 w-4' />
                              Ship
                            </FormLabel>
                          </div>
                          <div className='flex items-center space-x-2 rounded-lg border p-4'>
                            <RadioGroupItem value='pickup' id='pickup' />
                            <FormLabel
                              htmlFor='pickup'
                              className='flex items-center gap-2'
                            >
                              <Store className='h-4 w-4' />
                              Pickup in store
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    <FormItem className='flex flex-nowrap gap-2 items-center'>
                      <FormLabel className='order-2'>
                        Save shipping address information for faster checkout
                      </FormLabel>
                      <FormControl className='order-1 h-4 w-4'>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='your@email.com' {...field} />
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
                        <Input type='tel' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name='promoCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promo Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name='paymentMethod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='grid gap-4'
                        >
                          <div className='flex items-center space-x-2 rounded-lg border p-4'>
                            <RadioGroupItem value='stripe' id='stripe' />
                            <FormLabel
                              htmlFor='stripe'
                              className='flex items-center gap-2'
                            >
                              <CreditCard className='h-4 w-4' />
                              Credit Card
                            </FormLabel>
                          </div>
                          <div className='flex items-center space-x-2 rounded-lg border p-4'>
                            <RadioGroupItem value='paypal' id='paypal' />
                            <FormLabel
                              htmlFor='paypal'
                              className='flex items-center gap-2'
                            >
                              <svg
                                className='h-4 w-4'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M19.5 8.5h-2.5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2h-2.5'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                              PayPal
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
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
