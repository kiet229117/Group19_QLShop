import HeroSlider from '../components/HeroSlider'
import CategoryBanners from '../components/CategoryBanners'
import PopularProducts from '../components/PopularProducts'
import LatestProducts from '../components/LatestProducts'
import BrandSlider from '../components/BrandSlider'
import PromoBanner from '../components/PromoBanner'
import BlogSection from '../components/BlogSection'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. Main Hero Carousel */}
      <HeroSlider />

      {/* 2. Category Highlights */}
      <CategoryBanners />

      {/* 3. Popular Products */}
      <PopularProducts />

      {/* 4. Latest Products */}
      <LatestProducts />

      {/* 5. Brand Logos Slider */}
      <BrandSlider />

      {/* 6. Promotional Mid-Page Banner */}
      <PromoBanner />

      {/* 7. Blog / Trends */}
      <BlogSection />

      {/* 8. Newsletter Subscription */}
      <Newsletter />
    </main>
  )
}