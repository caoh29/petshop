import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) redirect('/');

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
      {children}
    </div>
  );
}
