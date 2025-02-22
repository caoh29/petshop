import { redirect } from 'next/navigation';
import { getUserByIdAdminAction } from '@/app/api/actions';
import UserDetails from '@/app/components/UserDetails';

interface Props {
  params: { id: string };
}

export default async function UserByIdPage({ params }: Readonly<Props>) {
  const { user } = await getUserByIdAdminAction(params.id);
  if (!user) redirect('/admin/users');

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-black'>User Details</h1>
      <div className='w-full flex flex-col flex-nowrap justify-center items-center'>
        <UserDetails user={user} />
      </div>
    </div>
  );
}
