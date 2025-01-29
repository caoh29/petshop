'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { Facebook, Instagram, Twitter } from 'lucide-react';
import FooterLinks from './FooterLinks';
import { Label } from './ui/label';
import { Input } from './ui/input';

const socials: { title: string; icon: ReactNode; href: string }[] = [
  {
    title: 'Facebook',
    icon: <Facebook />,
    href: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    title: 'Instagram',
    icon: <Instagram />,
    href: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    title: 'Twitter',
    icon: <Twitter />,
    href: 'XXXXXXXXXXXXXXXXXXXXXXXX',
  },
];

const links = [
  {
    title: '2025 PetShop',
    href: '/',
  },
  {
    title: 'About Us',
    href: '/about',
  },
  {
    title: 'Contact Us',
    href: '/contact',
  },
  {
    title: 'FAQ',
    href: '/faq',
  },
];

export default function Footer() {
  const path = usePathname();
  if (path === '/auth/signin' || path === '/auth/signup') return;

  return (
    <footer className='flex flex-col items-center justify-center py-10 px-8 bg-primary gap-12 text-white'>
      <FooterLinks />
      <div className='flex flex-row flex-nowrap justify-between items-center max-w-screen-md w-full'>
        <form className='flex flex-col gap-4' action=''>
          <Label htmlFor='email' className='order-1'>
            Subscribe to our emails
          </Label>
          <div className='order-2 flex gap-2 items-center h-10 w-full rounded-md bg-secondary px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'>
            <Input
              className='all-unset'
              type='email'
              name='email'
              placeholder='Email'
              required
            />
            <input
              className='cursor-pointer text-lg hover:scale-125 font-bold'
              type='submit'
              value='&rarr;'
            />
          </div>
        </form>
        <ul className='flex flex-nowrap gap-4 w-1/3 justify-center'>
          {socials.map((social) => (
            <li key={social.title}>
              <Link href={social.href}>{social.icon}</Link>
            </li>
          ))}
        </ul>
      </div>

      <hr className='w-full border border-input border-secondary' />
      <p>
        &copy;
        {links.map((link) => (
          <span key={link.title} className='mx-2 hover:underline'>
            <Link href={link.href}>{link.title}</Link>
          </span>
        ))}
      </p>
    </footer>
  );
}
