'use client';
import { useEffect, useRef } from 'react';

import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { AppStore, makeStore, setCart, setUserSession } from '../store/store';

import { type Cart } from '@/api/types';

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

  // If userId is null then persist the store in localStorage
  let persistor: any = null;
  if (userId === null) {
    persistor = persistStore(storeRef.current);
  }

  useEffect(() => {
    if (userId !== null && cart !== null) {
      storeRef.current?.dispatch(
        setUserSession({
          userId,
        }),
      );
      storeRef.current?.dispatch(setCart(cart));
    }
  }, [cart, userId]);

  return (
    <Provider store={storeRef.current}>
      {userId === null ? (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}
