import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { Category, Product, SubCategory } from '@/api/types';

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

export default function GridSection({ items, basePath }: Readonly<Props>) {
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
    <div className='flex justify-center max-w-screen-lg py-10 px-4 bg-primary'>
      <ul className='grid grid-cols-2 lg:grid-cols-3'>
        {items.map((item) => (
          <li key={item.name} className='m-4'>
            <Link href={getItemPath(item)}>
              {isProduct(item) && <ProductCard product={item} variant />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
