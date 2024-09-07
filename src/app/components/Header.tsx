'use client';
import { useState, useEffect, useRef } from 'react';

import { ShoppingCart } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

import { useDispatch } from 'react-redux';
import { setHeaderVisibility } from '../../store/store';

import { useCart, useHeaderVisibility } from '../../hooks';

import CartPopup from './CartPopup';
import { type Cart } from '@/api/types';

import { SearchBar } from './SearchBar';
import { NavBar } from './NavBar';
import { SideNavBar } from './SideNavBar';

export default function Header({
  clearCartAction,
}: Readonly<{
  clearCartAction: () => Promise<Cart>;
}>) {
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);

  const dispatch = useDispatch();
  const headerVisibility = useHeaderVisibility();
  // const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos.current;

      // if (isScrollingDown !== !isHeaderVisible && currentScrollPos > 150) {
      //   setIsHeaderVisible(!isScrollingDown);
      // }
      if (isScrollingDown !== !headerVisibility && currentScrollPos > 150) {
        // setIsHeaderVisible(!isScrollingDown);
        dispatch(setHeaderVisibility({ isVisible: !isScrollingDown }));
      }

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // }, [isHeaderVisible]);
  }, [headerVisibility, dispatch]);

  return (
    <header
      className={`${
        // isHeaderVisible ? 'top-0 ' : '-top-20'
        headerVisibility ? 'top-0 ' : '-top-20'
      } sticky z-10 flex items-center justify-center py-4 px-8 bg-[#2A5135] h-20 gap-8 transition-all ease-in duration-500`}
    >
      <SideNavBar className='lg:hidden' />
      <h2 className='scroll-m-20 text-3xl font-semibold text-amber-500 tracking-tight mx-auto order-2 lg:order-1 lg:mx-0'>
        PetShop
      </h2>
      <NavBar
        className='hidden lg:block lg:mx-auto lg:order-2'
        // isVisible={isHeaderVisible}
      />
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
