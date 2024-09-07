import { notFound } from 'next/navigation';

import { getProductById } from '@/api/products';
import { addToCartAction, addReviewAction } from '@/app/actions';

import ProductImageGallery from '@/app/components/ProductImageGallery';
import ProductDetails from '@/app/components/ProductDetails';
import RelatedProducts from '@/app/components/RelatedProducts';
import Reviews from '@/app/components/Reviews';

export const dynamic = 'force-dynamic';

export default async function ProductDetail({
  params: { id, category, subcategory },
}: Readonly<{
  params: { id: string; category: string; subcategory: string };
}>) {
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className='flex flex-wrap'>
      <ProductImageGallery
        images={product.additionalImages ?? []}
        productName={product.name}
        productImage={product.image}
      />

      <ProductDetails product={product} addToCartAction={addToCartAction} />

      <Reviews
        productId={id}
        reviews={product.reviews}
        addReviewAction={addReviewAction}
      />

      <RelatedProducts productId={id} />
    </div>
  );
}
