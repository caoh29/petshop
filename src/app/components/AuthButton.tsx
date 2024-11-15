'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAppDispatch, useUser } from '../../hooks';

import { clearCart, deleteUserSession, setRedirectPath } from '@/store/store';

import { logoutUserAction } from '../actions/auth';

import { Button } from './ui/button';

// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function AuthButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useUser();
  const pathname = usePathname();

  const handleSignOut = async () => {
    const res = await logoutUserAction();

    if (res.data?.isSignedOut) {
      dispatch(deleteUserSession());
      dispatch(clearCart());
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  const handleSignIn = () => {
    dispatch(setRedirectPath(pathname));
  };

  return (
    <div className='order-5 text-white'>
      {isAuthenticated ? (
        <Button onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Link href='/auth/signin' onClick={handleSignIn}>
          <Button>Sign In</Button>
        </Link>
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
