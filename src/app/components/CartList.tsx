'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useDispatch } from 'react-redux';

import { useCart } from '../../hooks';
import { Cart } from '@/api/types';
import { setCart } from '../../store/store';

import CartQuantitySelector from './CartQuantitySelector';

interface Props {
  updateCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
  deleteCartAction: (
    id: string,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
}

export default function CartList({
  updateCartAction,
  deleteCartAction,
}: Readonly<Props>) {
  const cart = useCart();
  const dispatch = useDispatch();

  return (
    <div className='container'>
      <h1 className='text-2xl font-bold mb-4'>Bag</h1>
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
                updateCartAction={updateCartAction}
              />
              <button
                className='text-red-500'
                onClick={async () =>
                  dispatch(
                    setCart(
                      await deleteCartAction(item.id, {
                        size: item.size,
                        color: item.color,
                      }),
                    ),
                  )
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
