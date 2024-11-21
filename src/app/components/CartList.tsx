'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCart } from '../../hooks';

import CartQuantitySelector from './CartQuantitySelector';
import CartDeleteSelector from './CartDeleteSelector';

interface Props {
  variant?: boolean;
}

export default function CartList({ variant = false }: Readonly<Props>) {
  const cart = useCart();

  return (
    <>
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
                {variant ? (
                  <h3 className={`text-base font-semibold`}>
                    {item.productName}
                  </h3>
                ) : (
                  <Link
                    className={`text-base font-semibold hover:underline`}
                    href={`/${item.productCategory}/${item.productSubcategory}/${item.productId}`}
                  >
                    {item.productName}
                  </Link>
                )}
                {cart.validatedProducts.find(
                  (product) => product.productId === item.productId,
                ) &&
                  !cart.validatedProducts.find(
                    (product) => product.productId === item.productId,
                  )?.isAvailable && (
                    <p className='text-red-500 w-3/4'>
                      The item quantity is not valid, reduce the quantity or
                      remove the product
                    </p>
                  )}
                <p className='text-gray-600'>
                  {variant
                    ? `Quantity: ${item.quantity}`
                    : `$${item.productPrice.toFixed(2)}`}
                </p>
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
              {variant ? (
                <p className='text-base font-semibold'>
                  ${item.productPrice.toFixed(2)}
                </p>
              ) : (
                <>
                  <CartQuantitySelector
                    quantity={item.quantity}
                    id={item.productId}
                    size={item.size}
                    color={item.color}
                  />
                  <CartDeleteSelector
                    id={item.productId}
                    size={item.size}
                    color={item.color}
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
