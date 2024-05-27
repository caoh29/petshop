import { titleFont } from '@/lib/fonts';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle'>
      <div className='text-center px-5 mx-5'>
        <h1 className={`${titleFont.className} antialiased text-9xl`}>404</h1>
        <p className='font-semibold text-xl'>Whoops! Something went wrong</p>
        <Link href={'/'} className='font-normal hover:underline transition-all'>
          Return to Home page
        </Link>
      </div>
      <div className='px-5 mx-5'>
        <Image
          src='/not-found.png'
          alt='Starman'
          width={550}
          height={550}
          className='p-5 sm:p-0'
        />
      </div>
    </div>
  );
}
