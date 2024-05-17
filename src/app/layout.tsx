import './globals.css';
import type { Metadata } from 'next';
import { titleFont } from '../lib/fonts';

import StoreProvider from './store/StoreProvider';
import Header from './components/Header';

import { getCart, clearCart } from '@/api/cart';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = await getCart();

  const clearCartAction = async () => {
    'use server';
    return await clearCart();
  };

  return (
    <html lang='en'>
      <body className={titleFont.className}>
        <StoreProvider cart={cart}>
          <Header clearCartAction={clearCartAction} />
          <main className='mx-auto max-w-3xl'>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
