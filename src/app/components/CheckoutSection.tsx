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

import { checkIfProceedToPayment } from '@/store/store';
import { useAppDispatch, useCheckout } from '@/hooks';

interface Props {
  userData: UserData;
  userId: string | null;
}

export default function CheckoutSection({ userData, userId }: Readonly<Props>) {
  const { deliveryMethod } = useCheckout();
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
          <EmailSection email={userData?.email ?? ''} />
          <ShippingAddressSection userData={userData} />
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
            isShippingSameAsBilling={isShippingSameAsBilling}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='payment'>
        <AccordionTrigger onClick={() => dispatch(checkIfProceedToPayment())}>
          Payment Information
        </AccordionTrigger>
        <AccordionContent>
          <PaymentSection userId={userId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
