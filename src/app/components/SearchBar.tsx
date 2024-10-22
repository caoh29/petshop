'use client';
import { useState } from 'react';

import { Search } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

import Data from '../../mocks/MOCK_DATA.json';
import Link from 'next/link';

// needs improvement
type Post = {
  id: number;
  product_name: string;
  category: string;
  sku: number;
};

export default function SearchBar({
  className,
}: Readonly<{ className?: string }>) {
  const [query, setQuery] = useState('');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Search
          color='white'
          className={`hover:scale-110 hover:cursor-pointer ${className}`}
        />
      </SheetTrigger>
      <SheetContent side='top' className='bg-[#2A5135]'>
        <div className='flex justify-center items-center gap-4 mb-5'>
          <label htmlFor='name' className='text-right text-white'>
            Search
          </label>
          <input
            id='name'
            type='text'
            className='w-4/5 border-2 border-slate-200 border-solid py-1 px-2 rounded'
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {query &&
          Data.filter((post: Post) => {
            if (post.product_name.toLowerCase().includes(query.toLowerCase())) {
              return post;
            }
          }).map((post) => (
            <Link
              className='p-2 border-2 border-slate-200 border-solid flex flex-col flex-nowrap hover:bg-slate-400'
              key={post.id}
              href={`/${post.category.toLowerCase().split(' ')[0]}/${
                post.product_name.toLowerCase().split(' ')[0]
              }`}
            >
              <p className='text-white'>{post.product_name}</p>
              <p className='text-slate-500 font-extralight text-sm'>
                {post.category}
              </p>
            </Link>
          ))}
        <SheetFooter>
          <SheetClose asChild>
            <button className='mt-5 mr-6 p-2 rounded bg-black text-white'>
              Submit
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
