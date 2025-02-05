import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { capitalizeString } from '@/lib/utils';
import type { Product } from '@/types/types';

interface Props {
  product: Product;
  variant?: boolean;
  className?: string;
}

export default function ProductCard({
  className = '',
  product,
  variant = false,
}: Readonly<Props>) {
  if (!product) return null;

  const discountedPrice = (
    product.price -
    (product.price * product.discount) / 100
  ).toFixed(2);

  return (
    <Card className={`h-full overflow-hidden w-full ${className}`}>
      <CardContent className={`p-0 flex flex-col ${variant ? 'h-full' : ''}`}>
        <div className='relative w-full pt-[100%]'>
          <Image
            src={product.image ?? '/placeholder.svg'}
            alt={product.name}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>
        <div className='flex flex-col justify-between flex-grow p-3 sm:p-4'>
          <div className='space-y-1'>
            <h3 className='font-semibold text-base sm:text-lg line-clamp-2 min-h-[2.5rem]'>
              {capitalizeString(product.name)}
            </h3>
            {!variant && (
              <p className='text-xs sm:text-sm text-muted'>
                {capitalizeString(product.category)}
              </p>
            )}
          </div>
          <div className='mt-auto pt-2'>
            {variant && product.discount > 0 && (
              <p className='text-destructive text-xs sm:text-sm line-through mb-1'>
                ${product.price.toFixed(2)}
              </p>
            )}
            <p className='font-bold text-base sm:text-lg'>${discountedPrice}</p>
          </div>
        </div>
      </CardContent>
      {!variant && (
        <CardFooter>
          <Link
            className='w-full'
            href={`/${product.category}/${product.subcategory}/${product.id}`}
          >
            <Button className='w-full'>See more details</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
