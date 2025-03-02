import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getOrderByIdUserAction } from '@/app/api/actions';
import { OrderDetails } from '@/app/components/OrderDetails';

interface Props {
  params: { id: string };
}

export default async function OrderByIdPage({ params }: Readonly<Props>) {
  const session = await auth();

  const { order } = await getOrderByIdUserAction({
    orderId: params.id,
  });

  if (!order) redirect('/orders');
  if (order.userId !== session?.user.id) redirect('/orders');

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Order Details</h1>
      <OrderDetails order={order} />
    </div>
  );
}
