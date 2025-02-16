'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  InputOTP as InputOTPComponent,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/app/components/ui/input-otp';

// import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { checkOTPAction } from '../api/actions';

export default function InputOTP() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const handleOnComplete = async (otp: string) => {
    if (!token) return;
    const newToken = await checkOTPAction(otp, new Date(), token);
    if (newToken) {
      router.replace(`/auth/forgot-password/reset?token=${newToken}`);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <>
      <InputOTPComponent
        maxLength={6}
        // pattern={REGEXP_ONLY_DIGITS}
        pattern={'^\\d+$'}
        inputMode='numeric'
        onComplete={handleOnComplete}
        onChange={() => setError(null)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTPComponent>
      {error && <p className='text-red-500 mt-2'>{error}</p>}
    </>
  );
}
