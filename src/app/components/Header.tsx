'use client';
import { useState } from 'react';

import { ShoppingCart } from 'lucide-react';

import { useCart } from '../../lib/hooks';

import CartPopup from './CartPopup';
import { type Cart } from '@/api/types';

import { SearchBar } from './SearchBar';
import { NavBar } from './NavBar';
import { SideNavBar } from './SideNavBar';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header({
  clearCartAction,
}: {
  clearCartAction: () => Promise<Cart>;
}) {
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <header className='sticky z-10 top-0 flex items-center justify-center py-4 px-8 bg-[#2A5135] h-20 gap-8'>
      <SideNavBar className='lg:hidden' />
      <h2 className='scroll-m-20 text-3xl font-semibold text-amber-500 tracking-tight mx-auto order-2 lg:order-1 lg:mx-0'>
        PetShop
      </h2>
      <NavBar className='hidden lg:block lg:mx-auto lg:order-2' />
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
      <div className='order-5 text-white'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
