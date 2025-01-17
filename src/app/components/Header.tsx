'use client';

import { usePathname } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';

// import { useDispatch } from 'react-redux';
// import { setHeaderVisibility } from '../../store/store';

import { useCart } from '../../hooks';

import SearchBar from './SearchBar';
import NavBar from './NavBar';
import SideNavBar from './SideNavBar';
import Logo from './Logo';
import ShoppingCart from './ShoppingCart';
import AuthButton from './AuthButton';

interface Props {
  userId: string | null;
  isAdmin: boolean;
}

export default function Header({ userId, isAdmin }: Readonly<Props>) {
  const cart = useCart();

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
      } sticky z-10 flex items-center justify-center py-4 px-4 sm:px-8 gap-4 sm:gap-8 bg-[#2A5135] h-20 w-full transition-all ease-in duration-500`}
    >
      <SideNavBar className='lg:hidden' isAdmin={isAdmin} userId={userId} />
      <Logo className='order-2 lg:order-1 lg:mx-0' />
      <NavBar
        className='hidden lg:block lg:mx-auto lg:order-2'
        isVisible={isHeaderVisible}
        isAdmin={isAdmin}
        userId={userId}
      />
      <SearchBar className='order-3' />
      <ShoppingCart
        className='order-4'
        showCartPopup={showCartPopup}
        setShowCartPopup={setShowCartPopup}
        cart={cart}
      />
      <AuthButton
        className='order-5 text-white hidden sm:block'
        userId={userId}
      />
    </header>
  );
}
