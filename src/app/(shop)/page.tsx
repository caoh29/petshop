// This is to revalidate the data after a change in the DB in seconds
// So if there is a change in the DB and the user is navigating in the page without triggering another fetch request
// it will be automatically fetched with the command below to revalidate teh data that is been displayed to the user
export const revalidate = 60;

import HeroSection from '../components/HeroSection';
import GridSection from '../components/GridSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';

import { getCategoriesAction } from '../actions';
import { auth } from '@/auth';

export default async function Home() {
  const categories = await getCategoriesAction();

  const session = await auth();
  const userId = session?.user?.id ?? null;

  return (
    <>
      <HeroSection />
      <FeaturedProductsSection />
      {/* <GridSection
        title='shop-by-animal'
        items={categories ?? []}
        userId={userId}
      /> */}
    </>
  );
}
