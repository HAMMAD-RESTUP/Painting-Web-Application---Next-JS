
import ShopHero from "../Components/shop/all/shopHeroSection";
import ShopCategories from "../Components/shop/all/shop-categories";
import FeaturedProduct from "../Components/shop/all/FeaturedProduct";
import OriginalPaintingsSlider from "../Components/shop/all/ShopAllArtworks";
import Follow from "../Components/shop/all/Follow";
export default function OriginalPaintingsPage() {
  return (
    <>

      {/* <ShopHero /> */}
      <OriginalPaintingsSlider />
      {/* <ShopCategories /> */}
      <FeaturedProduct />
      <Follow/>
  
    </>
  );
}