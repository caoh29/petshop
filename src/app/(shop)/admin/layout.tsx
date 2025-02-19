import { redirect } from 'next/navigation';
import { auth } from '@/auth';

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Readonly<Props>) {
  const session = await auth();
  if (!session?.user.isAdmin) redirect('/auth/signin');

  return <div className='px-4 py-8 sm:px-8'>{children}</div>;
}
