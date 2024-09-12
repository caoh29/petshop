// This is to revalidate the data after a change in the DB in seconds
// So if there is a change in the DB and the user is navigating in the page without triggering another fetch request
// it will be automatically fetched with the command below to revalidate teh data that is been displayed to the user
export const revalidate = 60;

// import { getProducts } from '@/api/products';
import { redirect } from 'next/navigation';

import { HeroSection } from '../components/HeroSection';
import { GridSection } from '../components/GridSection';
import { CarouselSection } from '../components/CarouselSection';
// import { Pagination } from '../components/Pagination';

import { getPaginatedProductsAction } from '../actions';

import { getCategories } from '@/api/categories';

// interface Props {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// }

export default async function Home() {
  // const products = await getProducts();
  const { products } = await getPaginatedProductsAction({});
  const categories = await getCategories();

  if (products.length === 0 || categories.length === 0) redirect('/');
  return (
    <>
      <HeroSection />
      <GridSection title='featured-products' items={products} />
      <CarouselSection title='hot-deals!' products={products} />
      <GridSection title='shop-by-animal' items={categories} />
    </>
  );
}
