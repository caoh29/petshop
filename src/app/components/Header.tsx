'use client';
import { useState } from 'react';

import { ShoppingCart } from 'lucide-react';

import { useCart } from '../store/store';

import CartPopup from './CartPopup';
import { type Cart } from '@/api/types';

import { SearchBar } from './SearchBar';
import { NavigationMenuDemo } from './Navbar2';

export default function Header({
  clearCartAction,
}: {
  clearCartAction: () => Promise<Cart>;
}) {
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <header className='flex items-center p-4 bg-teal-900 mb-10 h-32 gap-8'>
      <h2 className='scroll-m-20 text-3xl font-semibold text-amber-500 tracking-tight mx-auto order-2 lg:order-1 lg:mx-0'>
        PetShop
      </h2>

      <NavigationMenuDemo className='order-1 mx-auto lg:order-2' />

      <SearchBar className='order-3' />

      <button
        className='relative order-4'
        onClick={() => {
          setShowCart(!showCart);
        }}
      >
        <span className='absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white'>
          {cart.products.length}
        </span>
        {showCart && <CartPopup clearCartAction={clearCartAction} />}
        <ShoppingCart color='#ffffff' />
      </button>

      <button className='order-5'>Login</button>
    </header>
  );
}
