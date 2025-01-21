'use client';

import Link from 'next/link';

import { logoutUserAction } from '../actions';

import { Button } from './ui/button';

interface Props {
  userId: string | null;
  className?: string;
}

export default function AuthButton({ userId, className }: Readonly<Props>) {
  const handleSignOut = async () => {
    const res = await logoutUserAction();
    if (res.data?.isSignedOut) {
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className={className}>
      {userId ? (
        <Button variant={'secondary'} onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : (
        <Link href='/auth/signin'>
          <Button variant={'secondary'}>Sign In</Button>
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
