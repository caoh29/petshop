import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) redirect('/auth/signin');

  return <div>Profile Page</div>;
}
