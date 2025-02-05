import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getPaginatedOrdersByUserAction } from '@/app/actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import Link from 'next/link';
import Pagination from '@/app/components/Pagination';
import SortDropdown from '@/app/components/SortDropdown';

interface Props {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function OrdersPage({ searchParams }: Readonly<Props>) {
  const session = await auth();

  if (!session?.user) redirect('/auth/signin');

  const { orders, pages, currentPage } = await getPaginatedOrdersByUserAction({
    searchParams,
  });

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold'>Orders</h1>
      <div className='flex flex-col items-end gap-8'>
        <SortDropdown />
        <Table>
          <TableHeader>
            <TableRow className='bg-primary hover:bg-primary'>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Delivery Method</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className='bg-secondary hover:bg-secondary text-white text-left'
                >
                  <TableCell className='font-medium'>
                    <Link
                      className='underline hover:text-ternary'
                      href={`/orders/${order.id}`}
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.createdAt.toISOString()}</TableCell>
                  <TableCell>{order.deliveryMethod}</TableCell>
                  <TableCell className='text-right'>${order.total}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pages > 1 && (
          <Pagination totalPages={pages} currentPage={currentPage || 1} />
        )}
      </div>
    </div>
  );
}
