import { redirect } from 'next/navigation';
import { getOrderByIdAdminAction } from '@/app/api/actions';
import { OrderDetails } from '@/app/components/OrderDetails';

interface Props {
  params: { id: string };
}

export default async function OrderByIdAdminPage({ params }: Readonly<Props>) {
  const { order } = await getOrderByIdAdminAction({
    orderId: params.id,
  });

  if (!order) redirect('/admin/orders');

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Order Details</h1>
      <OrderDetails order={order} variant />
    </div>
  );
}
