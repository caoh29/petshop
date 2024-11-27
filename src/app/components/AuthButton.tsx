'use client';

import Link from 'next/link';

import { logoutUserAction } from '../actions';

import { Button } from './ui/button';

interface Props {
  userId: string | null;
}

export default function AuthButton({ userId }: Readonly<Props>) {
  const handleSignOut = async () => {
    const res = await logoutUserAction();
    if (res.data?.isSignedOut) {
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className='order-5 text-white'>
      {userId ? (
        <Button onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Link href='/auth/signin'>
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
