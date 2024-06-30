import Link from 'next/link';
import { FooterLinks } from './FooterLinks';

const socials: { title: string; href: string }[] = [
  {
    title: 'Facebook',
    href: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    title: 'Instagram',
    href: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    title: 'Twitter',
    href: 'XXXXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    title: 'Pinterest',
    href: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
];

const links = [
  {
    title: 'Home',
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

export function Footer() {
  return (
    <footer className='flex flex-col items-center justify-center py-10 px-8 bg-[#2A5135] gap-12'>
      <FooterLinks />
      <form action=''>
        <input type='text' placeholder='Email' />
        <button type='submit'>Subscribe to emails</button>
      </form>
      <ul className='flex flex-nowrap gap-4'>
        {socials.map((social) => (
          <li key={social.title}>
            <Link href={social.href}>{social.title}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <p>
        &copy; 2024 PetShop
        {links.map((link) => (
          <span key={link.title} className='mx-2'>
            <Link href={link.href}>{link.title}</Link>
          </span>
        ))}
      </p>
    </footer>
  );
}
