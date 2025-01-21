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
import ProductCard from './ProductCard';

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
    <section className={`${className} bg-accent py-12 `}>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        <h2 className='text-4xl text-muted px-4'>{capitalizeString(title)}</h2>
        <Carousel
          opts={{
            align: 'center',
          }}
          className={`w-full max-w-sm self-center md:max-w-xl lg:max-w-4xl`}
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.name}
                className='md:basis-1/2 lg:basis-1/3'
              >
                <Link
                  href={`/${product.category}/${product.subcategory}/${product.id}`}
                >
                  <ProductCard name={product.name} image={product.image} />
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
