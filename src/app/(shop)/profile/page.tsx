import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { getUserDefaultValuesAction } from '@/app/actions';

import ProfileForm from '@/app/components/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user || !session.user.id) redirect('/auth/signin');

  const defaultValues = await getUserDefaultValuesAction(session.user.id);

  const user = { ...session.user, ...defaultValues };

  return <ProfileForm user={user} />;
}
