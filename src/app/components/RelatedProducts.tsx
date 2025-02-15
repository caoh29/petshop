import Link from 'next/link';

import ProductCard from './ProductCard';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

import { getRelatedProductsAction } from '../api/actions/products';

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

  const getCarouselStyles = <T,>(items: T[]) => {
    const base = `w-full max-w-sm `;
    if (items.length === 0) {
      return 'hidden';
    } else if (items.length === 1) {
      return base;
    } else if (items.length === 2) {
      return base + 'md:max-w-xl';
    } else {
      return base + 'md:max-w-xl lg:max-w-4xl';
    }
  };

  const getCarouselItemStyles = <T,>(items: T[]) => {
    const base = ``;
    if (items.length === 0) {
      return 'hidden';
    } else if (items.length === 1) {
      return base;
    } else if (items.length === 2) {
      return base + 'md:basis-1/2';
    } else {
      return base + 'md:basis-1/2 lg:basis-1/3';
    }
  };

  return (
    <div
      className={`${
        className ?? ''
      } flex flex-col flex-nowrap gap-6 items-center w-full p-12 bg-secondary`}
    >
      <h2 className='text-3xl sm:text-4xl font-bold text-accent mb-8'>
        Related Products
      </h2>
      {products.length === 0 && (
        <p className='text-lg text-accent'>No related products found.</p>
      )}
      <Carousel
        opts={{
          align: 'center',
        }}
        className={getCarouselStyles(products)}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.name}
              className={getCarouselItemStyles(products)}
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
