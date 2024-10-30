import Link from 'next/link';
import PetCard from '../components/PetCard';
import { Category, Product, SubCategory } from '@/api/types';
import { capitalizeString } from '@/lib/utils';

type Item = Product | Category | SubCategory;

interface Props {
  title?: string;
  items: Item[];
  basePath?: string;
}

// Type guard to check if the item is a Product
function isProduct(item: Item): item is Product {
  return (item as Product).category !== undefined;
}

export default function GridSection({
  items,
  title,
  basePath,
}: Readonly<Props>) {
  const getItemPath = (item: Item) => {
    if (isProduct(item)) {
      // If basePath is provided, use it; otherwise, construct from item properties
      if (basePath) {
        if (basePath.split('/').length > 2) return `${basePath}/${item.id}`;
        return `${basePath}/${item.subcategory}/${item.id}`;
      } else {
        return `/${item.category}/${item.subcategory}/${item.id}`;
      }
    }
    // For Category or SubCategory, append to the current path
    return `/${item.name}`;
  };

  return (
    <section className='bg-slate-400 py-10'>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        {title && <h2 className='text-4xl px-4'>{capitalizeString(title)}</h2>}
        <ul className='grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {items &&
            items.map((item) => (
              <li key={item.name}>
                <Link href={getItemPath(item)}>
                  <PetCard {...item} />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
