'use client';
import { useState } from 'react';
import Link from 'next/link';

import { useCart } from '../store/store';

import CartPopup from './CartPopup';
import { type Cart } from '@/api/types';

import NavBar from './NavBar';

export default function Header({
  clearCartAction,
}: {
  clearCartAction: () => Promise<Cart>;
}) {
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <header className='flex items-center justify-between p-4 bg-teal-900 mb-10 h-32'>
      <h2 className='scroll-m-20 pb-2 text-3xl font-semibold text-amber-500 tracking-tight first:mt-0'>
        PetShop
      </h2>

      <NavBar />

      <button>Search</button>

      <button
        className='flex items-center justify-center w-10 h-10 bg-blue-700 rounded-full'
        onClick={() => {
          setShowCart(!showCart);
        }}
      >
        <span className='text-xl font-bold leading-10 text-gray-100'>
          {cart.products.length}
        </span>
        {showCart && <CartPopup clearCartAction={clearCartAction} />}
      </button>

      <button>Login</button>
    </header>
  );
}
