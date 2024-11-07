import './globals.css';
import type { Metadata } from 'next';

import StoreProvider from './StoreProvider';
import Header from './components/Header';
import Footer from './components/Footer';

// import { getCart } from '@/api/cart';
import { getCartAction } from './actions/cart';
// import { ClerkProvider } from '@clerk/nextjs';

import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cart = await getCart();
  // const userId = '272830cf-9709-41ef-81d3-24e10bfa2e39';
  const session = await auth();
  const userId = session?.user?.id ?? null;

  let cart = null;
  if (userId !== null) {
    cart = await getCartAction(userId);
  }

  console.log(session);

  return (
    // <ClerkProvider>
    <html lang='en'>
      <body>
        <StoreProvider cart={cart} userId={userId}>
          <Header />
          <main className=''>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}
