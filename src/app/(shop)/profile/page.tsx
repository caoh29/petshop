import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { getUserDefaultValuesAction } from '@/app/api/actions';

import ProfileForm from '@/app/components/ProfileForm';
import ChangePasswordForm from '@/app/components/ChangePasswordForm';
import AccountPreferencesForm from '@/app/components/AccountPreferencesForm';

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) redirect('/auth/signin');

  const defaultValues = await getUserDefaultValuesAction(userId);

  if (!defaultValues) redirect('/auth/signin');

  return (
    <div className='flex flex-col flex-nowrap gap-6'>
      <ProfileForm defaultValues={defaultValues} />
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
        <ChangePasswordForm userId={userId} />
      </div>

      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Account Preferences</h2>
        <AccountPreferencesForm />
      </div>
    </div>
  );
}
