import './globals.css';
import type { Metadata } from 'next';

import StoreProvider from './StoreProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';

import { getCartAction } from './api/actions/cart';
// import { ClerkProvider } from '@clerk/nextjs';

import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'My PetShop',
  description: 'Pet Shop',
};

// export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const isAdmin = session?.user?.isAdmin ?? false;

  let cart = null;
  if (userId !== null) {
    cart = await getCartAction(userId);
  }

  return (
    // <ClerkProvider>
    <html lang='en' className='scroll-smooth'>
      <body>
        <StoreProvider cart={cart} userId={userId}>
          <Header isAdmin={isAdmin} userId={userId} />
          <main className='w-full bg-accent md:min-h-[calc(70dvh-5rem)]'>
            {children}
          </main>
          <Toaster />
          <Footer />
        </StoreProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}
