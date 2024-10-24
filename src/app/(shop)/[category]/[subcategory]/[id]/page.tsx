import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// import { getProductById } from '@/api/products';
import {
  addProductToCartAction,
  addReviewAction,
  getProductByIdAction,
} from '@/app/actions';

import ProductImageGallery from '@/app/components/ProductImageGallery';
import ProductDetails from '@/app/components/ProductDetails';
import RelatedProducts from '@/app/components/RelatedProducts';
import Reviews from '@/app/components/Reviews';

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

export default async function ProductPage({
  params: { id, category, subcategory },
}: Readonly<Props>) {
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

      <ProductDetails
        product={product}
        addProductToCartAction={addProductToCartAction}
      />

      {/* <Reviews
        productId={product.id}
        reviews={product.reviews}
        addReviewAction={addReviewAction}
      /> */}

      <RelatedProducts
        productId={product.id}
        productCategory={product.category}
        productSubcategory={product.subcategory}
      />
    </div>
  );
}
