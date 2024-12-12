'use client';

import { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';

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

import { checkIfProceedToPayment } from '@/store/store';
import { useAppDispatch, useCheckout } from '@/hooks';

interface Props {
  userData: UserData;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutSection({ userData }: Readonly<Props>) {
  const { deliveryMethod } = useCheckout();
  const dispatch = useAppDispatch();
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] =
    useState<boolean>(false);

  return (
    <Accordion type='multiple' className='w-full'>
      <AccordionItem value='deliveryMethod'>
        <AccordionTrigger>Delivery Method</AccordionTrigger>
        <AccordionContent>
          <DeliverySection />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='contactInfo'>
        <AccordionTrigger>Contact Information</AccordionTrigger>
        <AccordionContent>
          <EmailSection email={userData?.email ?? ''} />
          <ShippingAddressSection
            userData={userData}
            stripePromise={stripePromise}
          />
          {deliveryMethod === 'ship' && (
            <Checkbox
              checked={isShippingSameAsBilling}
              onClick={() =>
                setIsShippingSameAsBilling(!isShippingSameAsBilling)
              }
            />
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='billingInfo'>
        <AccordionTrigger>Billing Information</AccordionTrigger>
        <AccordionContent>
          <BillingAddressSection
            stripePromise={stripePromise}
            isShippingSameAsBilling={isShippingSameAsBilling}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='review'>
        <AccordionTrigger onClick={() => dispatch(checkIfProceedToPayment())}>
          Payment Information
        </AccordionTrigger>
        <AccordionContent>
          <PaymentSection stripePromise={stripePromise} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
