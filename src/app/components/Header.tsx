'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';

import { signOut } from 'next-auth/react';

import { ShoppingCart } from 'lucide-react';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

// import { useDispatch } from 'react-redux';
// import { setHeaderVisibility } from '../../store/store';

import { useAppDispatch, useCart, useUserAuthentication } from '../../hooks';
import { clearCart, deleteUserSession } from '@/store/store';

import CartPopup from './CartPopup';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import SideNavBar from './SideNavBar';
import { Button } from './ui/button';

export default function Header() {
  const user = useUserAuthentication();
  const cart = useCart();
  const dispatch = useAppDispatch();

  const path = usePathname();

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  // const dispatch = useDispatch();
  // const headerVisibility = useHeaderVisibility();

  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos.current;

      if (isScrollingDown !== !isHeaderVisible && currentScrollPos > 150) {
        setIsHeaderVisible(!isScrollingDown);
      }
      // if (isScrollingDown !== !headerVisibility && currentScrollPos > 150) {
      //   dispatch(setHeaderVisibility({ isVisible: !isScrollingDown }));
      // }

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // }, [isHeaderVisible]);
  }, [isHeaderVisible]);

  if (path === '/auth/signin' || path === '/auth/signup') return;

  return (
    <header
      className={`${
        isHeaderVisible ? 'top-0 ' : '-top-20'
        // headerVisibility ? 'top-0 ' : '-top-20'
      } sticky z-10 flex items-center justify-center py-4 px-8 bg-[#2A5135] h-20 gap-8 transition-all ease-in duration-500`}
    >
      <SideNavBar className='lg:hidden' />
      <h2 className='scroll-m-20 text-3xl font-semibold text-amber-500 tracking-tight mx-auto order-2 lg:order-1 lg:mx-0'>
        PetShop
      </h2>
      <NavBar
        className='hidden lg:block lg:mx-auto lg:order-2'
        isVisible={isHeaderVisible}
      />
      <SearchBar className='order-3' />
      <button
        className='relative order-4'
        onClick={() => {
          setShowCartPopup(!showCartPopup);
        }}
      >
        <span className='absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white'>
          {cart.products.reduce((acc, product) => acc + product.quantity, 0)}
        </span>
        {showCartPopup && <CartPopup setShowCartPopup={setShowCartPopup} />}
        <ShoppingCart color='#ffffff' />
      </button>
      <div className='order-5 text-white'>
        {user.isAuthenticated ? (
          <Button
            onClick={() => {
              signOut();
              dispatch(deleteUserSession());
              dispatch(clearCart());
            }}
          >
            Sign Out
          </Button>
        ) : (
          <Link href='/auth/signin'>Sign In</Link>
        )}
        {/* <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn> */}
      </div>
    </header>
  );
}
