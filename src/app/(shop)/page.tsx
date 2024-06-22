import Link from 'next/link';

import { getProducts } from '@/api/products';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import PetCard from '../components/PetCard';

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
      <section className='bg-slate-400 py-10'>
        <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
          <h2 className='text-4xl px-4'>Featured Products</h2>
          <ul className='grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {/* {products.map((product) => (
              <li key={product.id} className='md:w-1/3'>
                <Link href={`/products/${product.id}`}>
                  <ProductCard {...product} />
                </Link>
              </li>
            ))} */}
            {products.map((product) => (
              <li key={product.name}>
                <Link href={`/shopByPet/${product.name}`}>
                  <PetCard {...product} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className='bg-green-400 py-8'>
        <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
          <h2 className='text-4xl px-4'>Hot deals</h2>
          <ul className='grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {products.map((product) => (
              <li key={product.name}>
                <Link href={`/shopByPet/${product.name}`}>
                  <PetCard {...product} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
