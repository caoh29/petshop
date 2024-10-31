import ProductFilters from '@/app/components/ProductFilters';
import SortDropdown from '@/app/components/SortDropdown';
import GridSection from '@/app/components/GridSection';
import Pagination from '@/app/components/Pagination';

import { capitalizeString } from '@/lib/utils';

import { getFiltersAction, getPaginatedProductsAction } from '../../actions';

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function SearchPage({ searchParams }: Readonly<Props>) {
  const { products, pages, currentPage } = await getPaginatedProductsAction({
    searchParams,
  });

  const { filters } = await getFiltersAction({ searchParams });

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>
        {capitalizeString(searchParams.query as string)}
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
          <GridSection items={products ?? []} />
          {pages > 1 && (
            <Pagination totalPages={pages} currentPage={currentPage || 1} />
          )}
        </div>
      </div>
    </div>
  );
}
