'use client';

import { useAppDispatch, useCheckout } from '@/hooks';

import { Stripe, StripeAddressElementChangeEvent } from '@stripe/stripe-js';
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { setBillingInfo } from '@/store/store';

const COUNTRY_CODE = 'CA';

interface Props {
  stripePromise: Promise<Stripe | null>;
  isShippingSameAsBilling: boolean;
}

export default function BillingAddressSection({
  stripePromise,
  isShippingSameAsBilling,
}: Readonly<Props>) {
  const { shippingInfo } = useCheckout();
  const dispatch = useAppDispatch();

  const handleChange = (event: StripeAddressElementChangeEvent) => {
    if (event.complete) {
      const { firstName, lastName, name } = event.value;
      const address = event.value.address;
      const { line1, line2, city, state, postal_code, country } = address;

      // Extract potentially complete address
      dispatch(
        setBillingInfo({
          firstName: firstName ?? name.split(' ')[0],
          lastName: lastName ?? name.split(' ')[1],
          address: line1,
          address2: line2 ?? undefined,
          city,
          state,
          zip: postal_code,
          country,
        }),
      );
    }
  };

  const getDefaultValues = () => {
    if (isShippingSameAsBilling) {
      const {
        firstName,
        lastName,
        address,
        address2,
        city,
        state,
        zip,
        country,
      } = shippingInfo;

      return {
        firstName,
        lastName,
        address: {
          line1: address,
          line2: address2,
          city,
          state,
          postal_code: zip,
          country,
        },
      };
    }
    return {
      firstName: '',
      lastName: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: COUNTRY_CODE,
      },
    };
  };

  return (
    <Elements stripe={stripePromise}>
      <AddressElement
        options={{
          mode: 'billing',
          allowedCountries: ['US', 'CA'],
          display: { name: 'split' },
          defaultValues: getDefaultValues(),
        }}
        onChange={handleChange}
      />
    </Elements>
  );
}
