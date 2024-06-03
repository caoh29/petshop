import Link from 'next/link';

import { getProducts } from '@/api/products';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <section className="min-h-[calc(100dvh-5rem)] relative flex justify-center bg-[url('/pets.jpeg')] bg-bottom bg-origin-border bg-no-repeat bg-cover md:bg-contain">
        <div className='min-h-[calc(100dvh-5rem)] max-w-sm flex flex-col gap-4 items-center text-center pt-[30dvh] px-4 md:pt-[15dvh] lg:absolute lg:left-0 lg:items-start lg:text-start lg:pl-[5dvw] lg:pt-[15dvh]'>
          <h1 className='text-black text-2xl font-medium'>Adventure Awaits</h1>
          <p className='font-light '>
            Make every moment a playful one with our stylish pet accessories
          </p>
          <Button className='self-center' asChild>
            <Link href='/shop'>Shop</Link>
          </Button>
        </div>
      </section>
      <section className='flex flex-wrap gap-2'>
        <ul className='flex flex-row flex-wrap m-2'>
          {products.map((product) => (
            <li key={product.id} className='md:w-1/3'>
              <Link href={`/products/${product.id}`}>
                <ProductCard {...product} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
