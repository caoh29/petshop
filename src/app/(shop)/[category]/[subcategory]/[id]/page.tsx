import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getProductById, addReview } from '@/api/products';
import { addToCart } from '@/api/cart';

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

  const addToCartAction = async (
    quantity: number,
    options: {
      size?: string;
      color?: string;
    },
  ) => {
    'use server';
    return await addToCart(id, {
      quantity,
      options,
    });
  };
  const addReviewAction = async (
    text: string,
    rating: number,
    userId: string,
  ) => {
    'use server';
    const reviews = await addReview(id, { text, rating, userId });
    revalidatePath(`/${category}/${subcategory}/${id}`);
    return reviews || [];
  };

  return (
    <div className='flex flex-wrap'>
      <ProductImageGallery
        images={product.additionalImages ?? []}
        productName={product.name}
        productImage={product.image}
      />

      <ProductDetails product={product} addToCartAction={addToCartAction} />

      <Reviews reviews={product.reviews} addReviewAction={addReviewAction} />

      <RelatedProducts productId={id} />
    </div>
  );
}
