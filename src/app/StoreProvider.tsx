'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { type Cart } from '@/api/types';
import { AppStore, makeStore, setCart } from '../store/store';

export default function StoreProvider({
  cart,
  children,
}: Readonly<{
  cart: Cart;
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(setCart(cart));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
