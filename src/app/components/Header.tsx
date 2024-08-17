'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

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
}: Readonly<{
  clearCartAction: () => Promise<Cart>;
}>) {
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos.current;

      if (isScrollingDown !== !isVisible && currentScrollPos > 150) {
        setIsVisible(!isScrollingDown);
      }

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  return (
    <header
      className={`${
        !isVisible ? '-top-20' : 'top-0 '
      } sticky z-10 flex items-center justify-center py-4 px-8 bg-[#2A5135] h-20 gap-8 transition-all ease-in duration-500`}
    >
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
