import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import Reviews from '@/app/components/Reviews';
import ProductCard from '@/app/components/ProductCard';

import { getProductById, getProducts, addReview } from '@/api/products';
import { addToCart } from '@/api/cart';

import ProductImageGallery from '@/app/components/ProductImageGallery';
import ProductDetails from '@/app/components/ProductDetails';

export const dynamic = 'force-dynamic';

export default async function ProductDetail({
  params: { id, category, subcategory },
}: Readonly<{
  params: { id: string; category: string; subcategory: string };
}>) {
  const product = await getProductById(+id);
  const products = await getProducts();

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
    return await addToCart(+id, {
      quantity,
      options,
    });
  };
  const addReviewAction = async (text: string, rating: number) => {
    'use server';
    const reviews = await addReview(+id, { text, rating });
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

      <div className='w-full'>
        <Reviews reviews={product.reviews} addReviewAction={addReviewAction} />
      </div>

      {/* Related Products */}
      <div className='flex flex-wrap gap-2 w-full'>
        <h1 className='text-2xl font-bold mt-2 -mb-2'>Related Products</h1>
        <ul className='flex flex-row flex-wrap m-2'>
          {products
            .filter((p) => p.id !== +id)
            .map((product) => (
              <li key={product.id} className='md:w-1/5'>
                <Link href={`/products/${product.id}`}>
                  <ProductCard {...product} small />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
