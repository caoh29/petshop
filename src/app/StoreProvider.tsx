'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { type Cart } from '@/api/types';
import { AppStore, makeStore, setCart, setUserSession } from '../store/store';

export default function StoreProvider({
  cart,
  userId,
  isAuthenticated,
  children,
}: Readonly<{
  cart: Cart | null;
  userId: string | null;
  isAuthenticated: boolean;
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(setCart(cart));
  }

  useEffect(() => {
    if (isAuthenticated && cart !== null && userId !== null) {
      storeRef.current?.dispatch(
        setUserSession({
          userId,
        }),
      );
      storeRef.current?.dispatch(setCart(cart));
    } else if (!isAuthenticated) {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        storeRef.current?.dispatch(setCart(JSON.parse(localCart)));
      } else {
        storeRef.current?.dispatch(
          setCart({ id: '', userId: '', products: [] }),
        );
      }
    }
  }, [cart, isAuthenticated]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
