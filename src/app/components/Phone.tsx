'use client';

import { useAppDispatch, useCheckout } from '@/hooks';
import { setPhone } from '@/store/store';
import { isEmptyString } from '@/lib/utils';

interface Props {
  phone: string | null;
}

export default function Phone({ phone }: Readonly<Props>) {
  const { phone: checkoutPhone } = useCheckout();
  const dispatch = useAppDispatch();

  const getDefaultValue = () => {
    if (!phone && isEmptyString(checkoutPhone)) {
      return '';
    } else if (phone && isEmptyString(checkoutPhone)) {
      return phone;
    } else {
      return checkoutPhone;
    }
  };

  return (
    <div className='flex items-center space-x-2 rounded-lg border p-4'>
      <label htmlFor='phone'>Phone</label>
      <input
        type='tel'
        name='phone'
        placeholder='444-222-1111'
        defaultValue={getDefaultValue()}
        pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
        onChange={(e) => {
          dispatch(setPhone(e.target.value));
        }}
      />
    </div>
  );
}
