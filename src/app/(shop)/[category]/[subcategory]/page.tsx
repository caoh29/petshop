import { getProductsBySubCategory } from '@/api/products';
import { VALID_ROUTES } from '@/api/routes';
import NotFound from '@/app/components/PageNotFound';
import { GridSection } from '@/app/components/GridSection';

export default async function SubCategoryPage({
  params,
}: Readonly<{
  params: { category: string; subcategory: string };
}>) {
  if (!VALID_ROUTES.has(`/${params.category}/${params.subcategory}`))
    return <NotFound />;

  const products = await getProductsBySubCategory(
    params.category,
    params.subcategory,
  );
  return <GridSection title={params.subcategory} products={products} />;
}
