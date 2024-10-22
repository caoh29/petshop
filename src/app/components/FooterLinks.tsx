'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const data: {
  title: string;
  href?: string;
  children?: {
    title: string;
    href: string;
    children?: { title: string; href: string }[];
  }[];
}[] = [
  {
    title: 'About Us',
    children: [
      {
        title: 'Returns & Exchanges',
        href: '/returns',
      },
      {
        title: 'Shipping & Delivery',
        href: '/shipping',
      },
    ],
  },
  {
    title: 'Customer Support',
    children: [
      {
        title: 'Returns & Exchanges',
        href: '/returns',
      },
      {
        title: 'Shipping & Delivery',
        href: '/shipping',
      },
    ],
  },
];

export default function FooterLinks() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <Accordion type='single' collapsible className='w-full'>
          {data.map((item) => (
            <AccordionItem key={item.title} value={`item-${item.title}`}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                <ul className='flex flex-col gap-2'>
                  {item.children?.map((child) => (
                    <li key={child.title}>
                      <Link href={child.href}>{child.title}</Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className='grid grid-cols-2 gap-10 max-w-screen-lg w-full justify-items-center'>
          {data.map((item, i) => (
            <div key={item.title} className={`order-${i + 1}`}>
              <h3 className='mb-4 text-lg font-bold'>{item.title}</h3>
              <ul className='flex flex-col gap-2'>
                {item.children?.map((child) => (
                  <li key={child.title}>
                    <Link href={child.href}>{child.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
