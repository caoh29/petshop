import Image from 'next/image';

import { Card, CardContent, CardFooter } from './ui/card';

import { capitalizeString } from '@/lib/utils';

import { Product } from '@/api/types';
import { Button } from './ui/button';
import Link from 'next/link';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Readonly<Props>) {
  if (!product) return null;
  return (
    <Card className='overflow-hidden even:hidden sm:even:block'>
      <CardContent className='p-0'>
        <div className='relative h-48 w-full'>
          <Image
            src={product.image ?? '/placeholder.svg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className='p-4'>
          <h3 className='font-semibold text-lg mb-1'>
            {capitalizeString(product.name)}
          </h3>
          <p className='text-sm text-gray-500 mb-2'>
            {capitalizeString(product.category)}
          </p>
          <p className='font-bold text-xl'>${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          className='w-full'
          href={`/${product.category}/${product.subcategory}/${product.id}`}
        >
          <Button className='w-full'>See more details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
