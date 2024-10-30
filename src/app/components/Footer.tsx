import Link from 'next/link';
import FooterLinks from './FooterLinks';
import { ReactNode } from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

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
    title: '2024 PetShop',
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
  return (
    <footer className='flex flex-col items-center justify-center py-10 px-8 bg-[#2A5135] gap-12'>
      <FooterLinks />
      <div className='flex flex-row flex-nowrap justify-between items-center max-w-screen-md w-full'>
        <form className='flex flex-col gap-4' action=''>
          <label htmlFor='email' className='order-1'>
            Subscribe to our emails
          </label>
          <div className='order-2 flex gap-2 items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
            <input
              className='all-unset'
              type='email'
              name='email'
              placeholder='Email'
            />
            <input
              className='cursor-pointer text-lg hover:scale-125'
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

      <hr className='w-full border border-input' />
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
