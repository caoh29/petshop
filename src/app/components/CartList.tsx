'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCart } from '../../hooks';

import { SelectedProduct } from '@/api/types';

import CartQuantitySelector from './CartQuantitySelector';
import CartDeleteSelector from './CartDeleteSelector';

interface Props {
  updateProductCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
    userId?: string,
  ) => Promise<SelectedProduct>;
  deleteProductCartAction: (
    id: string,
    options: { size?: string; color?: string },
    userId?: string,
  ) => Promise<number>;
}

export default function CartList({
  updateProductCartAction,
  deleteProductCartAction,
}: Readonly<Props>) {
  const cart = useCart();
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
                updateProductCartAction={updateProductCartAction}
              />
              <CartDeleteSelector
                id={item.productId}
                size={item.size}
                color={item.color}
                deleteProductCartAction={deleteProductCartAction}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
