'use client';
import { ChangeEvent, useState, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from './ui/sheet';
import { searchProductAction } from '../actions';
import { Product } from '@/api/types';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function SearchBar({
  className,
}: Readonly<{ className?: string }>) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (timeoutId.current) clearTimeout(timeoutId.current);

    if (newQuery.length >= 3) {
      setLoading(true); // Start loading
      timeoutId.current = setTimeout(async () => {
        const results = await searchProductAction(newQuery);
        setProducts(results);
        setLoading(false); // Stop loading after request completes
      }, 1000); // 1000 ms delay
    } else {
      setProducts([]);
      setLoading(false); // Ensure loading is false for short queries
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Search
          color='white'
          className={`hover:scale-110 hover:cursor-pointer ${className}`}
        />
      </SheetTrigger>
      <SheetContent side='top' className='bg-primary'>
        <div className='flex justify-center items-center gap-4 mb-5'>
          <label htmlFor='name' className='text-right text-white'>
            Search
          </label>
          <input
            id='name'
            type='text'
            className='w-4/5 border-2 border-slate-200 border-solid py-1 px-2 rounded'
            onChange={handleChange}
          />
        </div>
        {query.length >= 3 && !loading && products.length === 0 ? (
          <p className='text-white text-center'>
            No products matching your description were found.
          </p>
        ) : (
          products.map((product) => (
            <SheetClose key={product.id} asChild>
              <Link
                className='p-2 border-2 border-slate-200 border-solid flex flex-col flex-nowrap hover:bg-slate-400'
                href={`/${product.category}/${product.subcategory}/${product.id}`}
              >
                <p className='text-white'>{product.name}</p>
                <p className='text-slate-500 font-extralight text-sm'>
                  {product.category}
                </p>
              </Link>
            </SheetClose>
          ))
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant={'secondary'}
              onClick={() => {
                if (query.length > 0) {
                  router.push(`/search?query=${query}`);
                }
              }}
            >
              Submit
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
