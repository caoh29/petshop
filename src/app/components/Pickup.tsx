'use client';

import { useAppDispatch, useCheckout } from '@/hooks';
import { setPickupInfo } from '@/store/store';
import { isEmptyString } from '@/lib/utils';

import { Label } from './ui/label';

interface Props {
  name: string | null;
}

export default function Pickup({ name }: Readonly<Props>) {
  const { pickupInfo } = useCheckout();
  const dispatch = useAppDispatch();

  const getDefaultValue = () => {
    if (!name && isEmptyString(pickupInfo.name)) {
      return '';
    } else if (name && isEmptyString(pickupInfo.name)) {
      return name;
    } else {
      return pickupInfo.name;
    }
  };

  return (
    <div className='flex items-center space-x-2 rounded-lg border p-4'>
      <Label htmlFor='name'>Pickup Name</Label>
      <input
        type='text'
        name='name'
        placeholder='John Doe'
        required
        defaultValue={getDefaultValue()}
        onChange={(e) => {
          dispatch(setPickupInfo({ name: e.target.value.trim() }));
        }}
      />
    </div>
  );
}
