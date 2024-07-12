import Link from 'next/link';
import PetCard from '../components/PetCard';
import { Product } from '@/api/types';
import { capitalizeString } from '@/lib/utils';
// import ProductCard from '../components/ProductCard'

type Props = {
  products: Product[];
  title: string;
};

export function ProductsSection({ products, title }: Readonly<Props>) {
  return (
    <section className='bg-slate-400 py-10'>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        <h2 className='text-4xl px-4'>{capitalizeString(title)}</h2>
        <ul className='grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {/* {products.map((product) => (
              <li key={product.id} className='md:w-1/3'>
                <Link href={`/products/${product.id}`}>
                  <ProductCard {...product} />
                </Link>
              </li>
            ))} */}
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/${product.category}/${product.subcategory}/${product.id}`}
              >
                <PetCard {...product} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
