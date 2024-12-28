'use client';

import { useAppDispatch, useCheckout } from '@/hooks';
import { setEmail } from '@/store/store';
import { isEmptyString } from '@/lib/utils';

interface Props {
  email: string | null;
}

export default function Email({ email }: Readonly<Props>) {
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

  return (
    <div className='flex items-center space-x-2 rounded-lg border p-4'>
      <label htmlFor='email'>Email</label>
      <input
        type='email'
        name='email'
        placeholder='example@gmail.com'
        required
        defaultValue={getDefaultValue()}
        onChange={(e) => {
          dispatch(setEmail(e.target.value));
        }}
      />
    </div>
  );
}
