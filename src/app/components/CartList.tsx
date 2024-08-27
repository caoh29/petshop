'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCart } from '@/lib/hooks';
import CartQuantitySelector from './CartQuantitySelector';

export default function CartList() {
  const cart = useCart();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Cart Page</h1>
      {cart.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className='space-y-4'>
          {cart.products.map((item) => (
            <li
              key={item.id}
              className='flex items-center space-x-4 border-b pb-4'
            >
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className='object-cover'
              />
              <div className='flex-grow'>
                <h2 className='text-lg font-semibold'>{item.name}</h2>
                <p className='text-gray-600'>${item.price.toFixed(2)}</p>
                {item.size && !item.color && (
                  <p className='text-sm text-gray-500'>Size: {item.size}</p>
                )}
                {item.size && item.color && (
                  <p className='text-sm text-gray-500'>
                    Size: {item.size}, Color: {item.color}
                  </p>
                )}
              </div>
              <CartQuantitySelector
                quantity={item.quantity}
                id={item.id}
                size={item.size}
                color={item.color}
              />
              <button className='text-red-500'>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className='mt-4'>
        <p className='text-xl font-bold'>
          Total: ${cart.products.reduce((a, b) => a + b.price * b.quantity, 0)}
        </p>
      </div>
      <Link
        href='/'
        className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
      >
        Continue Shopping
      </Link>
    </div>
  );
}
