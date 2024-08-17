import Link from 'next/link';
import PetCard from '../components/PetCard';
import { Category, Product } from '@/api/types';
import { capitalizeString } from '@/lib/utils';

type Props = {
  products?: Product[];
  categories?: Category[];
  title: string;
};

export function GridSection({ products, categories, title }: Readonly<Props>) {
  return (
    <section className='bg-slate-400 py-10'>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        <h2 className='text-4xl px-4'>{capitalizeString(title)}</h2>
        <ul className='grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {products &&
            products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`${product.category}/${product.subcategory}/${product.id}`}
                >
                  <PetCard {...product} />
                </Link>
              </li>
            ))}
          {categories &&
            categories.map((category) => (
              <li key={category.name}>
                <Link href={`${category.name}`}>
                  <PetCard {...category} />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
