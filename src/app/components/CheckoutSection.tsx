'use client';

import { useState } from 'react';

import { UserData } from '../(shop)/checkout/page';
import DeliverySection from './DeliverySection';
import EmailSection from './EmailSection';
import ShippingAddressSection from './ShippingAddressSection';
import BillingAddressSection from './BillingAddressSection';
import PaymentSection from './PaymentSection';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Checkbox } from './ui/checkbox';

import { checkIfProceedToPayment, toggleSaveAddress } from '@/store/store';
import { useAppDispatch, useCheckout } from '@/hooks';
import { Label } from './ui/label';

import { loadStripe } from '@stripe/stripe-js';

interface Props {
  userData: UserData;
  userId: string | null;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutSection({ userData, userId }: Readonly<Props>) {
  const { deliveryMethod, saveAddress } = useCheckout();
  const dispatch = useAppDispatch();
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] =
    useState<boolean>(false);

  return (
    <Accordion
      className='w-full'
      type='single'
      defaultValue='deliveryMethod'
      collapsible
    >
      <AccordionItem value='deliveryMethod'>
        <AccordionTrigger>Delivery Method</AccordionTrigger>
        <AccordionContent>
          <DeliverySection />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='contactInfo'>
        <AccordionTrigger>Contact Information</AccordionTrigger>
        <AccordionContent>
          <div className='border-2 border-solid border-primary p-4 rounded-lg shadow-lg'>
            <EmailSection email={userData?.email ?? ''} />
            <ShippingAddressSection
              userData={userData}
              stripePromise={stripePromise}
            />
            {deliveryMethod === 'ship' && (
              <div className='flex flex-row flex-nowrap gap-2 mt-4'>
                <Checkbox
                  checked={isShippingSameAsBilling}
                  onClick={() =>
                    setIsShippingSameAsBilling(!isShippingSameAsBilling)
                  }
                />
                <Label>Is billing address same a shipping address?</Label>
              </div>
            )}
            {deliveryMethod === 'ship' && userId && (
              <div className='flex flex-row flex-nowrap gap-2 mt-4'>
                <Checkbox
                  checked={saveAddress}
                  onClick={() => dispatch(toggleSaveAddress())}
                />
                <Label>Do you want to save the address?</Label>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='billingInfo'>
        <AccordionTrigger>Billing Information</AccordionTrigger>
        <AccordionContent>
          <div className='border-2 border-solid border-primary p-4 rounded-lg shadow-lg'>
            <BillingAddressSection
              isShippingSameAsBilling={isShippingSameAsBilling}
              stripePromise={stripePromise}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='payment'>
        <AccordionTrigger onClick={() => dispatch(checkIfProceedToPayment())}>
          Payment Information
        </AccordionTrigger>
        <AccordionContent>
          <div className='border-2 border-solid border-primary p-4 rounded-lg shadow-lg'>
            <PaymentSection userId={userId} stripePromise={stripePromise} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
