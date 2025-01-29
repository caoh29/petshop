'use client';

import Image from 'next/image';
import Link from 'next/link';

import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent } from './ui/card';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

import { Product } from '@/api/types';

interface Props {
  products: Product[];
}

export default function DiscountCarousel({ products }: Readonly<Props>) {
  return (
    <Carousel
      opts={{
        align: 'center',
      }}
      className='w-full max-w-sm md:max-w-xl lg:max-w-4xl xl:max-w-6xl'
      plugins={[Autoplay({ delay: 5000 })]}
    >
      <CarouselContent>
        {products.length === 0 ? (
          <p className='text-destructive text-base'>
            No deals to show at this time :(
          </p>
        ) : (
          products.map((product) => (
            <CarouselItem
              key={product.id}
              className='md:basis-1/2 lg:basis-1/3'
            >
              <Link
                href={`/${product.category}/${product.subcategory}/${product.id}`}
              >
                <Card className='overflow-hidden max-w-4xl mx-auto border-2 border-solid border-secondary'>
                  <CardContent className='p-0 bg-primary'>
                    <div className='relative h-64 md:h-80'>
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute top-4 right-4 bg-destructive text-white px-4 py-2 rounded-full'>
                        {`${product.discount}% OFF`}
                      </div>
                    </div>
                    <div className='p-6 flex flex-col justify-center'>
                      <h3 className='text-lg text-accent font-semibold mb-4'>
                        {product.name}
                      </h3>
                      <div className='space-y-2'>
                        <p className='text-muted line-through font-bold'>
                          ${product.price.toFixed(2)}
                        </p>
                        <p className='text-2xl font-bold text-accent'>
                          $
                          {Number(
                            product.price -
                              (product.price * product.discount) / 100,
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious className='bg-primary text-accent hover:bg-secondary hover:text-white' />
      <CarouselNext className='bg-primary text-accent hover:bg-secondary hover:text-white' />
    </Carousel>
  );
}
