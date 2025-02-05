'use client';

import { useEffect } from 'react';
import { useAppDispatch, useCheckout } from '@/hooks';
import { setEmail } from '@/store/store';
import { isEmptyString } from '@/lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
    <div className='space-y-1 mb-2'>
      <Label>Email</Label>
      <Input
        type='email'
        name='email'
        placeholder='example@gmail.com'
        required
        defaultValue={defaultValue}
        className='bg-white'
        onChange={(e) => {
          dispatch(setEmail(e.target.value));
        }}
      />
    </div>
  );
}
