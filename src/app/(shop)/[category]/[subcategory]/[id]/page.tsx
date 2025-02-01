import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import {
  addProductToCartAction,
  addReviewAction,
  getProductByIdAction,
} from '@/app/actions';

import ProductImageGallery from '@/app/components/ProductImageGallery';
import ProductDetails from '@/app/components/ProductDetails';
import RelatedProducts from '@/app/components/RelatedProducts';
import Reviews from '@/app/components/Reviews';

import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string; category: string; subcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const product = await getProductByIdAction({ id });

  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [`/${product?.image}`],
    },
  };
}

export default async function ProductPage({ params: { id } }: Readonly<Props>) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const product = await getProductByIdAction({ id });

  if (!product) {
    notFound();
  }

  return (
    <div className='flex flex-col flex-nowrap justify-items-center items-center'>
      <div className='lg:grid lg:grid-cols-2 py-12 sm:px-6'>
        <ProductImageGallery
          className='order-1'
          images={product.additionalImages ?? []}
          productName={product.name}
          productImage={product.image}
        />

        <ProductDetails
          className='order-2'
          product={product}
          addProductToCartAction={addProductToCartAction}
          userId={userId}
        />
      </div>

      <RelatedProducts
        className='order-3 lg:col-span-2'
        productId={product.id}
        productCategory={product.category}
        productSubcategory={product.subcategory}
      />

      <Reviews
        className='order-4 lg:col-span-2'
        productId={product.id}
        reviews={product.reviews}
        addReviewAction={addReviewAction}
        userId={userId}
      />
    </div>
  );
}
