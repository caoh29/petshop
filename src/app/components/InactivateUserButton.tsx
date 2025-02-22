'use client';

import { toast } from 'sonner';

import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

import { inactivateUserAdminAction } from '../api/actions';

interface Props {
  userId: string;
}

export default function InactivateUserButton({ userId }: Readonly<Props>) {
  const handleClick = async () => {
    const { message } = await inactivateUserAdminAction(userId);
    toast(message);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Inactivate User</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-primary'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-ternary'>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-white'>
            This action cannot be undone. This will permanently inactivate the
            user account. User will be unable to login.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <Button variant='destructive'>Inactivate</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
