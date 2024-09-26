// import { getProductsBySubCategory } from '@/api/products';
import { VALID_ROUTES } from '@/api/routes';
import { GridSection } from '@/app/components/GridSection';
import { ProductFilters } from '@/app/components/ProductFilters';
import { SortDropdown } from '@/app/components/SortDropdown';
import NotFound from '@/app/components/PageNotFound';
import { capitalizeString } from '@/lib/utils';

import { getFiltersAction, getPaginatedProductsAction } from '../../../actions';
import { Pagination } from '@/app/components/Pagination';

export default async function SubCategoryPage({
  params,
  searchParams,
}: Readonly<{
  params: { category: string; subcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  if (!VALID_ROUTES.has(`/${params.category}/${params.subcategory}`))
    return <NotFound />;

  // const products = await getProductsBySubCategory(
  //   params.category,
  //   params.subcategory,
  //   searchParams,
  // );

  const { products, pages, currentPage } = await getPaginatedProductsAction({
    category: params.category,
    subcategory: params.subcategory,
    searchParams,
  });

  const { filters } = await getFiltersAction({
    category: params.category as string,
    subcategory: params.subcategory as string,
  });

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>
        {capitalizeString(params.subcategory)}
      </h1>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='w-full md:w-1/4'>
          <ProductFilters filterGroups={filters} />
        </div>
        <div className='w-full md:w-3/4'>
          <div className='flex justify-between items-center mb-4'>
            {products?.length ? (
              <p>{products.length} products</p>
            ) : (
              <p>No products found</p>
            )}
            <SortDropdown />
          </div>
          <GridSection
            items={products ?? []}
            basePath={`/${params.category}/${params.subcategory}`}
          />
          {pages > 1 && (
            <Pagination totalPages={pages} currentPage={currentPage || 1} />
          )}
        </div>
      </div>
    </div>
  );
}
