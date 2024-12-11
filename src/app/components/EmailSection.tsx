'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/hooks';
import { setEmail } from '@/store/store';

interface Props {
  email: string | null;
}

export default function EmailSection({ email }: Readonly<Props>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (email) {
      dispatch(setEmail(email));
    }
  }, [dispatch, email]);

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
          defaultValue={email ?? ''}
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
        />
      </div>
    </section>
  );
}
