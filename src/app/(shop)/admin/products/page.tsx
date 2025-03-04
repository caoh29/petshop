import { getPaginatedProductsAdminAction } from '@/app/api/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import Link from 'next/link';
import Pagination from '@/app/components/Pagination';
import SortDropdown from '@/app/components/SortDropdown';
import { SimplifiedProduct } from '@/types/types';
import { Button } from '@/app/components/ui/button';

interface Props {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function AdminProductsPage({
  searchParams,
}: Readonly<Props>) {
  const { products, pages, currentPage } =
    await getPaginatedProductsAdminAction({
      searchParams,
    });

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold text-black'>Products</h1>
      <div className='flex flex-col items-end gap-8'>
        <div className='w-full md:w-1/4 flex flex-row gap-4 justify-between'>
          <SortDropdown items={products} />
          <Button asChild>
            <Link href='/admin/products/create-product'>Create Product</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className='bg-primary hover:bg-primary'>
              <TableHead>Product ID</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className='text-right'>Discount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product: SimplifiedProduct) => (
                <TableRow
                  key={product.id}
                  className='bg-secondary hover:bg-secondary text-white'
                >
                  <TableCell className='font-medium'>
                    <Link
                      className='underline hover:text-ternary'
                      href={`/admin/products/${product.id}`}
                    >
                      {product.id}
                    </Link>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.subcategory}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className='text-right'>
                    {product.discount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pages > 1 && (
          <Pagination totalPages={pages} currentPage={currentPage || 1} />
        )}
      </div>
    </div>
  );
}
