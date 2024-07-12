import { getProducts } from '@/api/products';

import { HeroSection } from '../components/HeroSection';
import { ProductsSection } from '../components/ProductsSection';
import { CarouselSection } from '../components/CarouselSection';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <HeroSection />
      <ProductsSection title='featured-products' products={products} />
      <CarouselSection products={products} />
    </>
  );
}
