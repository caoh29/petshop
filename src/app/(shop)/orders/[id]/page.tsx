import { redirect } from 'next/navigation';
import { auth } from '@/auth';

interface Props {
  params: { id: string };
  // searchParams: {
  //   [key: string]: string | string[] | undefined;
  // };
}

export default async function OrderByIdPage({
  params, // searchParams,
}: Readonly<Props>) {
  const session = await auth();

  if (!session?.user) redirect('/auth/signin');
  return <div>Order ID #{params.id}</div>;
}
