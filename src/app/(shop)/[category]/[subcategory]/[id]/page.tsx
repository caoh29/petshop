import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getProductByIdAction } from '@/app/api/actions';

import ProductImageGallery from '@/app/components/ProductImageGallery';
import ProductDetailsHeader from '@/app/components/ProductDetailsHeader';
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
      <div className='lg:grid lg:grid-cols-2 sm:px-6'>
        <ProductDetailsHeader
          className='order-1 px-4 lg:hidden'
          productName={product.name}
          category={product.category}
          subcategory={product.subcategory}
          reviews={product.reviews}
        />

        <ProductImageGallery
          className='order-2 lg:order-1'
          images={product.additionalImages ?? []}
          productName={product.name}
          productImage={product.image}
        />

        <ProductDetails
          className='order-3 lg:order-2'
          product={product}
          userId={userId}
        />
      </div>

      <RelatedProducts
        className='order-4 lg:order-3 lg:col-span-2'
        productId={product.id}
        productCategory={product.category}
        productSubcategory={product.subcategory}
      />

      <Reviews
        className='order-5 lg:order-4 lg:col-span-2'
        productId={product.id}
        reviews={product.reviews}
        userId={userId}
      />
    </div>
  );
}
