import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCategoriesAction } from '../actions';
import { capitalizeString } from '@/lib/utils';

const TITLE = 'Shop By Animal';

export default async function ShopByCategorySection() {
  const categories = await getCategoriesAction();

  if (!categories || categories.length === 0) return null;

  return (
    <section className='py-12 px-6 bg-secondary justify-items-center'>
      <div className='container'>
        <h2 className='text-3xl font-bold text-white mb-8'>{TITLE}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={`/${category.name}`}
              className={`group relative overflow-hidden rounded-lg aspect-[4/3] ${
                [2, 3, 4].includes(index) && 'hidden sm:block'
              }`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className='object-cover transition-transform group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50' />
              <div className='absolute bottom-4 left-4 right-4 flex items-center justify-between text-white'>
                <span className='text-xl font-semibold'>
                  {capitalizeString(category.name)}
                </span>
                <ArrowRight className='h-5 w-5' />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
