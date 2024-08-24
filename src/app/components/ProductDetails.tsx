import AverageRating from '@/app/components/AverageRating';
import QuantitySelector from '@/app/components/QuantitySelector';
import SizeSelector from '@/app/components/SizeSelector';
import ColorSelector from '@/app/components/ColorSelector';
import AddToCart from '@/app/components/AddToCart';
import { capitalizeString } from '@/lib/utils';
import { Cart, Product } from '@/api/types';

interface ProductDetailsProps {
  product: Product;
  addToCartAction: (
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<Cart>;
}

export default function ProductDetails({
  product,
  addToCartAction,
}: Readonly<ProductDetailsProps>) {
  return (
    <div className='w-full md:w-1/2 p-4'>
      <h1 className='text-3xl font-bold leading-10 text-black'>
        {product.name}
      </h1>

      <h3 className='text-md leading-5 text-gray-300'>
        {capitalizeString(product.category)} -{' '}
        {capitalizeString(product.subcategory)}
      </h3>

      <AverageRating reviews={product.reviews} />

      <div className='my-1 text-md leading-5 text-gray-300'>
        {product.price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </div>

      <SizeSelector
        sizes={product.sizes ?? []}
        availableSizes={product.availableSizes ?? []}
      />

      <ColorSelector
        colors={product.colors ?? []}
        availableColors={product.availableColors ?? []}
      />

      <QuantitySelector />

      <div className='mt-1 text-sm leading-5 text-gray-300 font-light italic'>
        {product.description}
      </div>

      <div className='flex justify-end'>
        <AddToCart
          addToCartAction={addToCartAction}
          disabled={product.isOutOfStock}
          product={product}
        />
      </div>
    </div>
  );
}
