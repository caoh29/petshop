// import { getProducts } from '@/api/products';
import { getCategories } from '@/api/categories';

import { HeroSection } from '../components/HeroSection';
import { GridSection } from '../components/GridSection';
import { CarouselSection } from '../components/CarouselSection';
import { getPaginatedProducts } from '@/lib/actions';

export default async function Home() {
  // const products = await getProducts();
  const products = await getPaginatedProducts();
  const categories = await getCategories();
  return (
    <>
      <HeroSection />
      <GridSection title='featured-products' items={products} />
      <CarouselSection title='hot-deals!' products={products} />
      <GridSection title='shop-by-animal' items={categories} />
    </>
  );
}
