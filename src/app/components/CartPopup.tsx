'use client';
import { useDispatch } from 'react-redux';
import { type Cart } from '@/api/types';
import { setCart } from '../../store/store';
import { useCart } from '../../hooks';
import Link from 'next/link';

export default function CartPopup({
  clearCartAction,
}: {
  clearCartAction: () => Promise<Cart>;
}) {
  const dispatch = useDispatch();
  const cart = useCart();

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='flex flex-col items-center justify-center w-1/2 p-4 bg-white rounded-lg'>
        <h2 className='mb-4 text-2xl font-bold leading-10 text-gray-800'>
          Your Cart
        </h2>
        {cart.products.length === 0 && (
          <p className='mb-4 text-lg leading-7 text-gray-600'>
            You have 0 items in your cart.
          </p>
        )}
        {cart.products.length > 0 && (
          <>
            {cart.products.map((product, index) => {
              const price = product.price * product.quantity;
              return (
                <div
                  key={index}
                  className='flex text-black w-full justify-between'
                >
                  <div className='font-bold'>
                    {product.name}
                    {product.color && `(${product.color})`}
                  </div>
                  <div>{product.size}</div>
                  <div>{product.quantity}</div>
                  <div className=''>
                    {price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div className='flex justify-between w-full'>
          <button
            className='mt-6 px-4 py-2 text-lg font-bold text-white bg-green-800 rounded-lg'
            onClick={async () => {
              dispatch(setCart(await clearCartAction()));
            }}
          >
            Clear Cart
          </button>
          <Link
            className='mt-6 px-4 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg'
            href={'/cart'}
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
