import DiscountCarousel from './DiscountCarousel';
import { getPaginatedDealsAction } from '../actions';

const TITLE = 'Hot Deals!';

export default async function HotDealsSection() {
  const { products } = await getPaginatedDealsAction({ take: 6 });

  return (
    <section className='bg-accent py-12'>
      <div className='container mx-auto px-4 justify-items-center'>
        <h2 className='text-3xl sm:text-4xl font-bold text-muted text-center mb-8'>
          {TITLE}
        </h2>
        <DiscountCarousel products={products ?? []} />
      </div>
    </section>
  );
}
