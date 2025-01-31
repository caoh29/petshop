import Link from 'next/link';

import ProductCard from './ProductCard';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

import { getRelatedProductsAction } from '../actions/products';

interface Props {
  productId: string;
  productCategory?: string;
  productSubcategory?: string;
  className?: string;
}

export default async function RelatedProducts({
  productId: id,
  productCategory: category,
  productSubcategory: subcategory,
  className,
}: Readonly<Props>) {
  const products = await getRelatedProductsAction({
    id,
    category,
    subcategory,
  });

  return (
    <div
      className={`${
        className ?? ''
      } flex flex-col flex-nowrap gap-6 items-center w-full p-12 bg-secondary`}
    >
      <h2 className='text-3xl sm:text-4xl font-bold text-accent mb-8'>
        Related Products
      </h2>
      <Carousel
        opts={{
          align: 'center',
        }}
        className={`w-full max-w-sm md:max-w-xl lg:max-w-4xl`}
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
                <ProductCard product={product} variant />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
