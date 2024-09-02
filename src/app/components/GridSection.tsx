import Link from 'next/link';
import PetCard from '../components/PetCard';
import { Category, Product, SubCategory } from '@/api/types';
import { capitalizeString } from '@/lib/utils';

type ProductOrCategoryOrSubCategory = Product | Category | SubCategory;

interface Props {
  title?: string;
  items: ProductOrCategoryOrSubCategory[];
}

// Unified function to render either products or categories
const renderItems = (
  items: ProductOrCategoryOrSubCategory[],
  getPath: (item: ProductOrCategoryOrSubCategory) => string,
) => {
  return items.map((item) => (
    <li key={item.name}>
      <Link href={getPath(item)}>
        <PetCard {...item} />
      </Link>
    </li>
  ));
};

export function GridSection({ items, title }: Readonly<Props>) {
  return (
    <section className='bg-slate-400 py-10'>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        {title && <h2 className='text-4xl px-4'>{capitalizeString(title)}</h2>}
        <ul className='grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {items &&
            renderItems(items, (item) => {
              if (item.id) {
                return `${item.category}/${item.subcategory}/${item.id}`;
              }
              return `${item.name}`;
            })}
        </ul>
      </div>
    </section>
  );
}
