import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) redirect('/auth/signin');

  return <div>Admin Page</div>;
}
