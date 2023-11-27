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

type Post = {
  id: number;
  product_name: string;
  category: string;
  sku: number;
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  return (
    <div className='grid grid-cols-2 gap-2'>
      <Sheet>
        <SheetTrigger asChild>
          <Search color='white' className='hover:scale-110' />
        </SheetTrigger>
        <SheetContent side='top'>
          <div className='flex justify-center gap-4'>
            <label htmlFor='name' className='text-right'>
              Search
            </label>
            <input
              id='name'
              type='text'
              className='w-4/5'
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {query &&
            Data.filter((post: Post) => {
              if (
                post.product_name.toLowerCase().includes(query.toLowerCase())
              ) {
                return post;
              }
            }).map((post, index) => (
              <div className='box' key={post.id}>
                <p>{post.product_name}</p>
                <p>{post.category}</p>
              </div>
            ))}
          <SheetFooter>
            <SheetClose asChild>
              <button className='mt-5 mr-6 bg-black text-white'>Submit</button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
