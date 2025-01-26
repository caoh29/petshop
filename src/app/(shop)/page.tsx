// This is to revalidate the data after a change in the DB in seconds
// So if there is a change in the DB and the user is navigating in the page without triggering another fetch request
// it will be automatically fetched with the command below to revalidate teh data that is been displayed to the user
export const revalidate = 60;

import HeroSection from '../components/HeroSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import HotDealsSection from '../components/HotDealsSection';
import ShopByCategorySection from '../components/ShopByCategorySection';
export default async function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProductsSection />
      <HotDealsSection />
      <ShopByCategorySection />
    </>
  );
}
