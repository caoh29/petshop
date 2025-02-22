'use client';

import { toast } from 'sonner';

import { Button } from './ui/button';

import { promoteUserToAdminAction } from '../api/actions';

interface Props {
  userId: string;
}

export default function PromoteUserButton({ userId }: Readonly<Props>) {
  const handleClick = async () => {
    const { message } = await promoteUserToAdminAction(userId);
    toast(message);
  };
  return (
    <Button variant={'secondary'} onClick={handleClick}>
      Promote to Admin
    </Button>
  );
}
