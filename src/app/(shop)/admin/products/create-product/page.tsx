import CreateProduct from '@/app/components/CreateProduct';
import { getCategoriesAction } from '@/app/api/actions';

export default async function CreateProductPage() {
  const categories = await getCategoriesAction();
  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-black'>Create New Product</h1>
      <div className='w-full flex flex-col flex-nowrap justify-center items-center'>
        <CreateProduct categories={categories} />
      </div>
    </div>
  );
}
