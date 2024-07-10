import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const HERO_BRANDING =
  'Make every moment a playful one with our stylish pet accessories';

export function HeroSection() {
  return (
    <section className="min-h-[calc(100dvh-5rem)] relative flex justify-center bg-[url('/pets.jpeg')] bg-bottom bg-origin-border bg-no-repeat bg-cover md:bg-contain">
      <div className='min-h-[calc(100dvh-5rem)] max-w-sm flex flex-col gap-4 items-center text-center pt-[30dvh] px-4 md:pt-[15dvh] lg:absolute lg:left-0 lg:items-start lg:text-start lg:pl-[5dvw] lg:pt-[15dvh]'>
        <h1 className='text-black text-2xl font-medium'>Adventure Awaits</h1>
        <p className='font-light '>{HERO_BRANDING}</p>
        <Button className='self-center' asChild>
          <Link href='/shop'>Shop</Link>
        </Button>
      </div>
    </section>
  );
}
