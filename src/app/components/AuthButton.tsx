'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useUserAuthentication } from '../../hooks';

import { clearCart, deleteUserSession } from '@/store/store';

import { logoutUserAction } from '../actions/auth';

import { Button } from './ui/button';

// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function AuthButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useUserAuthentication();

  const handleClick = async () => {
    const res = await logoutUserAction();

    if (res.data?.isSignedOut) {
      dispatch(deleteUserSession());
      dispatch(clearCart());
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className='order-5 text-white'>
      {user.isAuthenticated ? (
        <Button onClick={handleClick}>Sign Out</Button>
      ) : (
        <Link href='/auth/signin'>Sign In</Link>
      )}
      {/* <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn> */}
    </div>
  );
}
