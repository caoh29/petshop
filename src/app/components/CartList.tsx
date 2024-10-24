'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAppDispatch, useCart, useUserAuthentication } from '../../hooks';

import { SelectedProduct } from '@/api/types';
import { deleteProductFromCart } from '../../store/store';

import CartQuantitySelector from './CartQuantitySelector';

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
  const { userId, isAuthenticated } = useUserAuthentication();
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
                updateProductCartAction={updateProductCartAction}
              />
              <button
                className='text-red-500'
                onClick={async () => {
                  if (isAuthenticated) {
                    await deleteProductCartAction(
                      item.productId,
                      {
                        size: item.size ?? '',
                        color: item.color ?? '',
                      },
                      userId,
                    );
                  } else {
                    localStorage.setItem(
                      'cart',
                      JSON.stringify(
                        cart.products.filter(
                          (product) =>
                            product.productId !== item.productId &&
                            product.size !== item.size &&
                            product.color !== item.color,
                        ),
                      ),
                    );
                  }
                  dispatch(
                    deleteProductFromCart({
                      productId: item.productId,
                      size: item.size ?? '',
                      color: item.color ?? '',
                    }),
                  );
                }}
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
