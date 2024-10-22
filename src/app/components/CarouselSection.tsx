import Link from 'next/link';

import { Card, CardContent } from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

import { Product } from '@/api/types';
import { capitalizeString } from '@/lib/utils';

interface Props {
  title: string;
  products: Product[];
  className?: string;
}

export default function CarouselSection({
  title,
  products,
  className,
}: Readonly<Props>) {
  return (
    <section className={`${className} bg-green-400 py-12 `}>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        <h2 className='text-4xl px-4'>{capitalizeString(title)}</h2>
        <Carousel
          opts={{
            align: 'center',
          }}
          className={`w-full max-w-sm self-center md:max-w-xl lg:max-w-4xl`}
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem
                key={product.name}
                className='md:basis-1/2 lg:basis-1/3'
              >
                <Link
                  href={`/${product.category}/${product.subcategory}/${product.id}`}
                >
                  <Card>
                    <CardContent className='flex aspect-square items-center justify-center p-6'>
                      <span className='text-4xl font-semibold'>
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
