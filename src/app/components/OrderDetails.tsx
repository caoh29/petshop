import type { DetailedOrder } from '@/types/types';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Truck, CreditCard, CalendarDays } from 'lucide-react';

interface Props {
  order: DetailedOrder;
  variant?: boolean;
}

export function OrderDetails({ order, variant }: Readonly<Props>) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'succeeded':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'canceled':
        return 'bg-red-700/10 text-red-700 hover:bg-red-700/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  return (
    <div className='flex flex-col gap-8 md:grid md:grid-cols-2'>
      <div className='relative'>
        <Card className='bg-primary md:sticky md:top-24'>
          <CardHeader className='space-y-1'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-white'>Order Number</p>
                <CardTitle className='text-ternary'>{order.id}</CardTitle>
              </div>
              <Badge
                className={`${getStatusColor(order.status)}`}
                variant='secondary'
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-8'>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4 text-white' />
                  <span className='text-sm text-white'>
                    {new Date(order.createdAt).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {variant && (
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-secondary'>
                      Customer Details
                    </p>
                    <p className='text-sm text-white'>{order.user.name}</p>
                    <p className='text-sm text-white'>{order.user.email}</p>
                    {order.user.phone && (
                      <p className='text-sm text-white'>{order.user.phone}</p>
                    )}
                    <div className='flex items-center gap-2'>
                      <CreditCard className='h-4 w-4 text-white' />
                      <span className='text-sm text-white'>
                        Paid with {order.paymentMethod}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className='space-y-4'>
                <div className='flex items-start gap-2'>
                  <Truck className='h-4 w-4 text-white mt-0.5' />
                  <div className='space-y-1'>
                    <p className='text-sm text-white'>{order.deliveryMethod}</p>
                    <p className='text-sm text-white'>
                      {order.shippingAddress}
                    </p>
                    {order.trackingNumber && (
                      <p className='text-sm'>
                        Tracking:{' '}
                        <span className='font-medium'>
                          {order.trackingNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-primary'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-secondary'>Order Items</CardTitle>
            <p className='text-lg font-semibold underline underline-offset-4 text-ternary'>
              Total: ${order.total.toFixed(2)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className='divide-y'>
            {order.products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className='grid gap-4 py-4 sm:grid-cols-[100px_1fr] sm:gap-6'
              >
                <div className='relative aspect-square h-[100px] w-[100px] rounded-lg overflow-hidden'>
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='grid gap-1'>
                  <h3 className='font-medium text-ternary'>{product.name}</h3>
                  <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-white'>
                    <span>Qty: {product.quantity}</span>
                    {product.size && <span>Size: {product.size}</span>}
                    {product.color && <span>Color: {product.color}</span>}
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                  {variant && (
                    <div className='text-sm text-secondary mt-1'>
                      <span>{product.category + ' '}</span>
                      {product.subcategory && (
                        <>
                          • <span>{product.subcategory}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
