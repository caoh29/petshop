'use client';

import { useAppDispatch, useCheckout } from '@/hooks';

import { Stripe, StripeAddressElementChangeEvent } from '@stripe/stripe-js';
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { setShippingInfo } from '@/store/store';
import { isEmptyString } from '@/lib/utils';

import { UserData } from '../(shop)/checkout/page';

const COUNTRY_CODE = 'CA';

interface Props {
  userData: UserData;
  stripePromise: Promise<Stripe | null>;
}

export default function ShippingAddressSection({
  userData,
  stripePromise,
}: Readonly<Props>) {
  const { deliveryMethod, shippingInfo } = useCheckout();
  const dispatch = useAppDispatch();

  if (deliveryMethod === 'pickup') {
    return null;
  }

  const handleChange = (event: StripeAddressElementChangeEvent) => {
    if (event.complete) {
      const { firstName, lastName, name, phone } = event.value;
      const address = event.value.address;
      const { line1, line2, city, state, postal_code, country } = address;

      // Extract potentially complete address
      dispatch(
        setShippingInfo({
          firstName: firstName ?? name.split(' ')[0],
          lastName: lastName ?? name.split(' ')[1],
          phone,
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
      phone,
      address,
      address2,
      city,
      state,
      zip,
      country,
    } = shippingInfo;

    if (
      !userData &&
      isEmptyString(firstName) &&
      isEmptyString(lastName) &&
      isEmptyString(phone) &&
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
        phone: '',
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
      userData &&
      isEmptyString(firstName) &&
      isEmptyString(lastName) &&
      isEmptyString(phone) &&
      isEmptyString(address) &&
      isEmptyString(address2) &&
      isEmptyString(city) &&
      isEmptyString(state) &&
      isEmptyString(zip) &&
      isEmptyString(country)
    ) {
      return {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: {
          line1: userData.address,
          line2: userData.address2,
          city: userData.city,
          state: userData.state,
          postal_code: userData.zip,
          country: userData.country,
        },
      };
    } else {
      return {
        firstName,
        lastName,
        phone,
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
          mode: 'shipping',
          allowedCountries: ['US', 'CA'],
          display: { name: 'split' },
          fields: {
            phone: 'always',
          },
          validation: {
            phone: {
              required: 'never',
            },
          },
          defaultValues: getDefaultValues(),
        }}
        onChange={handleChange}
      />
    </Elements>
  );
}
