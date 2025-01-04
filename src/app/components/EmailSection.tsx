'use client';

import { useEffect } from 'react';
import { useAppDispatch, useCheckout } from '@/hooks';
import { setEmail } from '@/store/store';
import { isEmptyString } from '@/lib/utils';

interface Props {
  email: string | null;
}

export default function EmailSection({ email }: Readonly<Props>) {
  const { email: checkoutEmail } = useCheckout();
  const dispatch = useAppDispatch();

  const getDefaultValue = () => {
    if (!email && isEmptyString(checkoutEmail)) {
      return '';
    } else if (email && isEmptyString(checkoutEmail)) {
      return email;
    } else {
      return checkoutEmail;
    }
  };

  const defaultValue = getDefaultValue();

  useEffect(() => {
    // Dispatch the default email value to the state management store
    if (!isEmptyString(defaultValue)) {
      dispatch(setEmail(defaultValue));
    }
  }, [defaultValue, dispatch]);

  return (
    <section className='flex flex-col flex-nowrap gap-6 rounded-lg bg-white p-8 shadow-sm'>
      <h1 className='text-2xl font-semibold'>Contact</h1>
      <div className='flex items-center space-x-2 rounded-lg border p-4'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          placeholder='example@gmail.com'
          required
          defaultValue={defaultValue}
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
        />
      </div>
    </section>
  );
}
