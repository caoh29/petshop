import type { Product } from '@/types/types';
import QuantitySelector from '@/app/components/QuantitySelector';
import SizeSelector from '@/app/components/SizeSelector';
import ColorSelector from '@/app/components/ColorSelector';
import AddToCart from '@/app/components/AddToCart';
import ProductDetailsHeader from '@/app/components/ProductDetailsHeader';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface Props {
  product: Product;
  userId: string | null;
  className?: string;
}

export default function ProductDetails({
  product,
  userId,
  className,
}: Readonly<Props>) {
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  return (
    <Card
      className={`${
        className ?? ''
      } w-full rounded-none border-none bg-none shadow-none`}
    >
      <CardHeader>
        <ProductDetailsHeader
          className='hidden lg:block'
          productName={product.name}
          category={product.category}
          subcategory={product.subcategory}
          reviews={product.reviews}
          isOutOfStock={product.isOutOfStock}
        />
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-baseline space-x-2'>
          {product.discount > 0 ? (
            <>
              <span className='text-2xl font-bold text-primary'>
                {discountedPrice.toLocaleString('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                })}
              </span>
              <span className='text-lg text-gray-500 line-through'>
                {product.price.toLocaleString('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                })}
              </span>
              <Badge variant='destructive'>{product.discount}% OFF</Badge>
            </>
          ) : (
            <span className='text-2xl font-bold text-primary'>
              {product.price.toLocaleString('en-CA', {
                style: 'currency',
                currency: 'CAD',
              })}
            </span>
          )}
        </div>

        <Separator />

        <div className='space-y-4'>
          <SizeSelector
            sizes={product.sizes ?? []}
            availableSizes={product.availableSizes ?? []}
          />
          <ColorSelector
            colors={product.colors ?? []}
            availableColors={product.availableColors ?? []}
          />
          <QuantitySelector />
        </div>

        <Separator />

        <div className='space-y-2'>
          <h3 className='font-semibold'>Description</h3>
          <p className='text-sm text-gray-500'>{product.description}</p>
        </div>

        <div className='text-sm text-gray-500'>
          SKU: <span className='font-medium'>{product.sku}</span>
        </div>

        <div className='flex justify-center'>
          <AddToCart
            className='mt-6'
            product={product}
            disabled={product.isOutOfStock}
            sizes={product.sizes ?? []}
            colors={product.colors ?? []}
            userId={userId}
          />
        </div>
      </CardContent>
    </Card>
  );
}
