'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { type Cart } from '@/api/types';
import { AppStore, makeStore, setCart, setUserSession } from '../store/store';

export default function StoreProvider({
  cart,
  userId,
  children,
}: Readonly<{
  cart: Cart | null;
  userId: string | null;
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(setCart(cart));
  }

  useEffect(() => {
    if (userId !== null && cart !== null) {
      storeRef.current?.dispatch(
        setUserSession({
          userId,
        }),
      );
      storeRef.current?.dispatch(setCart(cart));
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        storeRef.current?.dispatch(setCart(JSON.parse(localCart)));
      } else {
        storeRef.current?.dispatch(
          setCart({ id: '', userId: '', products: [] }),
        );
      }
    }
  }, [cart, userId]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
