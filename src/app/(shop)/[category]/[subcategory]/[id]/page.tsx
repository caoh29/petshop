import { notFound } from 'next/navigation';

// import { getProductById } from '@/api/products';
import {
  addToCartAction,
  addReviewAction,
  getProductByIdAction,
} from '@/app/actions';

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
  const product = await getProductByIdAction({ id });

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
        productId={product.id}
        reviews={product.reviews}
        addReviewAction={addReviewAction}
      />

      <RelatedProducts
        productId={product.id}
        productCategory={product.category}
        productSubcategory={product.subcategory}
      />
    </div>
  );
}
