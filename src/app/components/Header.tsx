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

  const prevScrollPosRef = useRef(0);
  const [count, setCount] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const isScrollingDown = currentScrollPos > prevScrollPosRef.current;

    if (isScrollingDown !== !isVisible) {
      setIsVisible(!isScrollingDown);
    }

    prevScrollPosRef.current = currentScrollPos;
    setCount(count + 1);
  }, [isVisible, count]);

  // const handleScroll = () => {
  //   const currentScrollPos = window.scrollY;
  //   const isScrollingDown = currentScrollPos > prevScrollPosRef.current;

  //   if (isScrollingDown !== !isVisible) {
  //     setIsVisible(!isScrollingDown);
  //   }

  //   prevScrollPosRef.current = currentScrollPos;
  //   setCount(count + 1);
  // };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, count, handleScroll]);

  return (
    <header
      className={`${
        !isVisible ? 'invisible' : 'visible'
      } sticky z-10 top-0 flex items-center justify-center py-4 px-8 bg-[#2A5135] h-20 gap-8 ease-in duration-500`}
    >
      <SideNavBar className='lg:hidden' />
      <h2 className='scroll-m-20 text-3xl font-semibold text-amber-500 tracking-tight mx-auto order-2 lg:order-1 lg:mx-0'>
        PetShop {count}
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
