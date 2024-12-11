'use client';

import { useCheckout, useAppDispatch } from '@/hooks';
import { setDeliveryMethod } from '@/store/store';
import { Store, Truck } from 'lucide-react';

export default function DeliverySection() {
  const { deliveryMethod } = useCheckout();
  const dispatch = useAppDispatch();

  return (
    <section className='flex flex-col flex-nowrap gap-6 rounded-lg bg-white p-8 shadow-sm'>
      <h1 className='text-2xl font-semibold'>Delivery</h1>
      <div className='grid gap-4'>
        <div className='flex items-center space-x-2 rounded-lg border p-4'>
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
        <div className='flex items-center space-x-2 rounded-lg border p-4'>
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
      </div>
    </section>
  );
}
