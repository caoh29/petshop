import { Product } from '@/api/types';
import { CarouselComponent } from '../components/Carousel';

type Props = {
  products: Product[];
};

export function CarouselSection({ products }: Readonly<Props>) {
  return (
    <section className='bg-green-400 py-12'>
      <div className='max-w-screen-lg flex flex-col gap-6 mx-auto'>
        <h2 className='text-4xl px-4'>Hot deals</h2>
        <CarouselComponent
          className='self-center md:max-w-xl lg:max-w-4xl'
          items={products}
        />
      </div>
    </section>
  );
}
