'use client';

import { isEmptyString } from '@/lib/utils';

import { useAppDispatch, useCheckout } from '@/hooks';

import { StripeAddressElementChangeEvent } from '@stripe/stripe-js';
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { setBillingInfo } from '@/store/store';

const COUNTRY_CODE = 'CA';

interface Props {
  isShippingSameAsBilling: boolean;
}

export default function BillingAddressSection({
  isShippingSameAsBilling,
}: Readonly<Props>) {
  const { shippingInfo, billingInfo, stripePromise } = useCheckout();
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
    const {
      firstName,
      lastName,
      address,
      address2,
      city,
      state,
      zip,
      country,
    } = billingInfo;

    if (
      !isShippingSameAsBilling &&
      isEmptyString(firstName) &&
      isEmptyString(lastName) &&
      isEmptyString(address) &&
      isEmptyString(address2) &&
      isEmptyString(city) &&
      isEmptyString(state) &&
      isEmptyString(zip) &&
      isEmptyString(country)
    ) {
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
    } else if (
      isShippingSameAsBilling &&
      isEmptyString(firstName) &&
      isEmptyString(lastName) &&
      isEmptyString(address) &&
      isEmptyString(address2) &&
      isEmptyString(city) &&
      isEmptyString(state) &&
      isEmptyString(zip) &&
      isEmptyString(country)
    ) {
      return {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: {
          line1: shippingInfo.address,
          line2: shippingInfo.address2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zip,
          country: shippingInfo.country,
        },
      };
    } else {
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
