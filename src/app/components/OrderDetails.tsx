import { DetailedOrder } from '@/types/types';
import Image from 'next/image';

interface Props {
  order: DetailedOrder;
}

export function OrderDetails({ order }: Readonly<Props>) {
  return (
    <div className='bg-white shadow-md rounded-lg p-6 space-y-6'>
      <h2 className='text-2xl font-semibold'>Order Number: {order.id}</h2>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h3 className='text-lg font-medium'>Order Information</h3>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
        </div>
        <div>
          <h3 className='text-lg font-medium'>Shipping Information</h3>
          <p>{order.shippingAddress}</p>
          <p>Delivery Method: {order.deliveryMethod}</p>
          {order.trackingNumber && (
            <p>Tracking Number: {order.trackingNumber}</p>
          )}
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium'>Products</h3>
        <div className='space-y-4'>
          {order.products.map((prod) => (
            <div
              key={prod.id}
              className='flex items-center space-x-4 border-b pb-4'
            >
              <Image
                src={prod.image}
                alt={prod.name}
                width={80}
                height={80}
                className='rounded-md'
              />
              <div>
                <h4 className='font-medium'>{prod.name}</h4>
                <p>Quantity: {prod.quantity}</p>
                {prod.size && <p>Size: {prod.size}</p>}
                {prod.color && <p>Color: {prod.color}</p>}
                <p>Price: ${prod.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium'>Payment Information</h3>
        <p>Payment Method: {order.paymentMethod}</p>
      </div>
    </div>
  );
}
