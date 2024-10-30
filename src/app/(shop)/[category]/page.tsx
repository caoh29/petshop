// import { getProductsByCategory } from '@/api/products';
import { VALID_ROUTES } from '@/api/routes';

import ProductFilters from '@/app/components/ProductFilters';
import SortDropdown from '@/app/components/SortDropdown';
import GridSection from '@/app/components/GridSection';
import NotFound from '@/app/components/PageNotFound';
import Pagination from '@/app/components/Pagination';

import { capitalizeString } from '@/lib/utils';

import { getFiltersAction, getPaginatedProductsAction } from '../../actions';

interface Props {
  params: { category: string };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: Readonly<Props>) {
  if (!VALID_ROUTES.has(`/${params.category}`)) return <NotFound />;
  // const products = await getProductsByCategory(params.category, searchParams);

  const { products, pages, currentPage } = await getPaginatedProductsAction({
    category: params.category,
    searchParams,
  });

  const { filters } = await getFiltersAction({
    category: params.category,
  });

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>
        {capitalizeString(params.category)}
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
            basePath={`/${params.category}`}
          />
          {pages > 1 && (
            <Pagination totalPages={pages} currentPage={currentPage || 1} />
          )}
        </div>
      </div>
    </div>
  );
}
