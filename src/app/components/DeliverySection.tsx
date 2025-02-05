'use client';

import { useCheckout, useAppDispatch } from '@/hooks';
import { setDeliveryMethod } from '@/store/store';
import { Store, Truck } from 'lucide-react';

export default function DeliverySection() {
  const { deliveryMethod } = useCheckout();
  const dispatch = useAppDispatch();

  return (
    <section className='flex flex-col flex-nowrap gap-4 border-2 border-solid border-primary rounded-lg p-4 shadow-lg'>
      <div className='flex items-center space-x-2 rounded-lg border-2 border-solid p-4 bg-white'>
        <input
          type='radio'
          name='deliveryMethod'
          id='ship'
          value='ship'
          onChange={() => dispatch(setDeliveryMethod('ship'))}
          checked={deliveryMethod === 'ship'}
        />
        <label htmlFor='ship' className='flex items-center gap-2'>
          <Truck className='h-4 w-4' />
          Ship
        </label>
      </div>
      <div className='flex items-center space-x-2 rounded-lg border-2 border-solid p-4 bg-white'>
        <input
          type='radio'
          name='deliveryMethod'
          id='pickup'
          value='pickup'
          onChange={() => dispatch(setDeliveryMethod('pickup'))}
          checked={deliveryMethod === 'pickup'}
        />
        <label htmlFor='pickup' className='flex items-center gap-2'>
          <Store className='h-4 w-4' />
          Pickup in store
        </label>
      </div>
    </section>
  );
}
