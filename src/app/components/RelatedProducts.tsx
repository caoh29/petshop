import Link from 'next/link';
import Image from 'next/image';

import { getProducts } from '@/api/products';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Card, CardContent } from './ui/card';

interface Props {
  productId: string;
}

export default async function RelatedProducts({ productId }: Readonly<Props>) {
  const products = await getProducts();

  return (
    <div className='flex flex-col flex-wrap gap-6 w-full p-4'>
      <h1 className='text-2xl font-bold mt-2 -mb-2'>Related Products</h1>
      <Carousel
        opts={{
          align: 'center',
        }}
        className={`w-full max-w-sm self-center md:max-w-xl lg:max-w-4xl`}
      >
        <CarouselContent>
          {products
            .filter((p) => p.id !== productId)
            .map((product) => (
              <CarouselItem
                key={product.name}
                className='md:basis-1/2 lg:basis-1/3'
              >
                <Link
                  href={`/${product.category}/${product.subcategory}/${product.id}`}
                >
                  <Card>
                    <CardContent className='flex aspect-square items-center justify-center p-6'>
                      <Image
                        className={`aspect-[2/2] rounded-md object-cover`}
                        src={product.image ?? ''}
                        alt={`${product.name} image`}
                        width={1024}
                        height={1024}
                      />
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <ul className='flex flex-row flex-wrap m-2'>
        {products
          .filter((p) => p.id !== +productId)
          .map((product) => (
            <li key={product.id} className='md:w-1/5'>
              <Link
                href={`/${product.category}/${product.subcategory}/${product.id}`}
              >
                <ProductCard {...product} small />
              </Link>
            </li>
          ))}
      </ul> */}
    </div>
  );
}
