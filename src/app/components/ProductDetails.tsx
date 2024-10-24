// 'use client';

// import { useRef } from 'react';
// import { useStore } from 'react-redux';
// import { resetProductState, RootState } from '../../store/store';

import AverageRating from '@/app/components/AverageRating';
import QuantitySelector from '@/app/components/QuantitySelector';
import SizeSelector from '@/app/components/SizeSelector';
import ColorSelector from '@/app/components/ColorSelector';
import AddToCart from '@/app/components/AddToCart';
import { capitalizeString } from '@/lib/utils';
import { Product, SelectedProduct } from '@/api/types';

interface ProductDetailsProps {
  product: Product;
  addProductToCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
    userId?: string,
  ) => Promise<SelectedProduct>;
}

export default function ProductDetails({
  product,
  addProductToCartAction,
}: Readonly<ProductDetailsProps>) {
  // const store = useStore<RootState>();
  // const initialized = useRef(false);
  // if (!initialized.current) {
  //   store.dispatch(resetProductState());
  //   initialized.current = true;
  // }
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

      <div className='mt-1 text-red-600'>
        <span>SKU: {product.sku}</span>
      </div>

      <div className='flex justify-end'>
        <AddToCart
          product={product}
          addProductToCartAction={addProductToCartAction}
          disabled={product.isOutOfStock}
          sizes={product.sizes ?? []}
          colors={product.colors ?? []}
        />
      </div>
    </div>
  );
}
