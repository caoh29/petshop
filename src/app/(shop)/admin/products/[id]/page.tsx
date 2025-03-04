import { redirect } from 'next/navigation';
import {
  getProductByIdAdminAction,
  getCategoriesAction,
} from '@/app/api/actions';
import EditProduct from '@/app/components/EditProduct/index';
// import EditProduct from '@/app/components/EditProduct';

interface Props {
  params: {
    id: string;
  };
}

export default async function AdminProductByIdPage({
  params,
}: Readonly<Props>) {
  const { product } = await getProductByIdAdminAction(params.id);
  if (!product) redirect('/admin/products');
  const categories = await getCategoriesAction();
  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-black'>Product Details</h1>
      <div className='w-full flex flex-col flex-nowrap justify-center items-center'>
        <EditProduct product={product} categories={categories} />
      </div>
    </div>
  );
}
