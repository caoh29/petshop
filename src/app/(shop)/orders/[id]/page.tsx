import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getOrderByIdAction } from '@/app/actions';
import { OrderDetails } from '@/app/components/OrderDetails';

interface Props {
  params: { id: string };
}

export default async function OrderByIdPage({ params }: Readonly<Props>) {
  const session = await auth();

  if (!session?.user || !session.user.id) redirect('/auth/signin');

  const { order } = await getOrderByIdAction({
    userId: session.user.id,
    orderId: params.id,
  });

  if (!order) redirect('/orders');
  if (order.userId !== session.user.id) redirect('/orders');

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Order Details</h1>
      <OrderDetails order={order} />
    </div>
  );
}
