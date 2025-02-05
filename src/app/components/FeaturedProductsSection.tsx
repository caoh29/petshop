import ProductCard from './ProductCard';

import { getFeaturedProductsAction } from '../actions';

export default async function FeaturedProductsSection() {
  const { products } = await getFeaturedProductsAction({ take: 6 });
  return (
    <section className='py-12 bg-secondary'>
      <div className='container max-w-screen-lg mx-auto px-4'>
        <h2 className='text-3xl sm:text-4xl font-bold text-accent text-center mb-8'>
          Featured Products
        </h2>
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      </div>
    </section>
  );
}
