import Image from 'next/image';

import { Card, CardContent } from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Product } from '@/api/types';
import Link from 'next/link';

interface CarouselProps {
  items: Product[];
  className?: string;
}

export function CarouselComponent({ items, className }: CarouselProps) {
  return (
    <Carousel
      opts={{
        align: 'center',
      }}
      className={`w-full max-w-sm ${className}`}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={item.name} className='md:basis-1/2 lg:basis-1/3'>
            <Link href={`/product/${item.id}`}>
              <Card>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                  <span className='text-4xl font-semibold'>{index + 1}</span>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
