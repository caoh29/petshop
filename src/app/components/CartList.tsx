'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAppDispatch, useCart } from '../../hooks';

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
  const dispatch = useAppDispatch();

  return (
    <div className='container'>
      <h1 className='text-2xl font-bold mb-4'>Bag</h1>
      {cart.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className='space-y-4'>
          {cart.products.map((item) => (
            <li
              key={item.productId}
              className='flex items-center space-x-4 border-b pb-4'
            >
              <Image
                src={item.productImage}
                alt={item.productName}
                width={100}
                height={100}
                className='object-cover'
              />
              <div className='flex-grow'>
                <Link
                  className='text-lg font-semibold hover:underline'
                  href={`/${item.productCategory}/${item.productSubcategory}/${item.productId}`}
                >
                  {item.productName}
                </Link>
                <p className='text-gray-600'>${item.productPrice.toFixed(2)}</p>
                {item.size && !item.color && (
                  <p className='text-sm text-gray-500'>Size: {item.size}</p>
                )}
                {item.size && item.color && (
                  <p className='text-sm text-gray-500'>
                    Size: {item.size}, Color: {item.color}
                  </p>
                )}
                {!item.size && item.color && (
                  <p className='text-sm text-gray-500'>Color: {item.color}</p>
                )}
              </div>
              <CartQuantitySelector
                quantity={item.quantity}
                id={item.productId}
                size={item.size}
                color={item.color}
                updateCartAction={updateCartAction}
              />
              <button
                className='text-red-500'
                onClick={async () =>
                  dispatch(
                    setCart(
                      await deleteCartAction(item.productId, {
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
