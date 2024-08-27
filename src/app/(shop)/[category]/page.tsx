import { getProductsByCategory } from '@/api/products';
import { VALID_ROUTES } from '@/api/routes';
import NotFound from '@/app/components/PageNotFound';
import { GridSection } from '@/app/components/GridSection';

export default async function CategoryPage({
  params,
}: Readonly<{
  params: { category: string };
}>) {
  if (!VALID_ROUTES.has(`/${params.category}`)) return <NotFound />;

  const products = await getProductsByCategory(params.category);
  return <GridSection title={params.category} products={products} />;
}
