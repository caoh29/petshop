import { getProductsByCategory } from '@/api/products';
import { VALID_ROUTES } from '@/api/routes';
import NotFound from '@/app/components/PageNotFound';
import { ProductsSection } from '@/app/components/ProductsSection';

export default async function CategoryPage({
  params,
}: Readonly<{
  params: { category: string };
}>) {
  if (!VALID_ROUTES.has(`/${params.category}`)) return <NotFound />;

  const products = await getProductsByCategory(params.category);
  return <ProductsSection title={params.category} products={products!} />;
}
