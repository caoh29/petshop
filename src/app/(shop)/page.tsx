import Link from 'next/link';

import { getProducts } from '@/api/products';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <section className="min-h-screen relative bg-center bg-origin-border bg-contain bg-no-repeat bg-[url('/pets.jpeg')]">
        <div className='h-screen flex flex-col gap-4 items-center pt-32 md:absolute md:pl-8'>
          <h1 className='text-black md:text-2xl font-medium'>
            Your pet is family and family is LIFE!
          </h1>
          <p>We have the best products for your pet</p>
          <Button asChild>
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
