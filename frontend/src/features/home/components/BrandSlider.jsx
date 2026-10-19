import { useState } from 'react'

const brands = [
  { name: 'HTML5', logo: '/assets/images/brands/html.svg' },
  { name: 'JavaScript', logo: '/assets/images/brands/js.svg' },
  { name: 'Laravel', logo: '/assets/images/brands/laravel.svg' },
  { name: 'PHP', logo: '/assets/images/brands/php.svg' },
  { name: 'React', logo: '/assets/images/brands/react.svg' },
  { name: 'Tailwind CSS', logo: '/assets/images/brands/tailwind.svg' },
  { name: 'TypeScript', logo: '/assets/images/brands/typescript.svg' },
]

export default function BrandSlider() {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 6

  const nextBrands = () => {
    setStartIndex((prev) => (prev + 1) % brands.length)
  }

  const prevBrands = () => {
    setStartIndex((prev) => (prev - 1 + brands.length) % brands.length)
  }

  // Circular slicing for smooth display
  const displayedBrands = []
  for (let i = 0; i < visibleCount; i++) {
    displayedBrands.push(brands[(startIndex + i) % brands.length])
  }

  return (
    <section id="brands" className="bg-gray-lighter py-16 px-4">
      <div className="container mx-auto max-w-screen-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-dark mb-3">
            Discover <span className="text-primary">Our Brands</span>
          </h2>
          <p className="text-gray-txt text-base md:text-lg">
            Explore the top brands we feature in our store
          </p>
        </div>

        <div className="relative px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {displayedBrands.map((brand, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-line h-24 flex items-center justify-center p-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                title={brand.name}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-12 max-w-[80px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevBrands}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-line shadow hover:bg-primary hover:text-white text-gray-dark flex items-center justify-center transition-colors"
            aria-label="Previous Brand"
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button
            onClick={nextBrands}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-line shadow hover:bg-primary hover:text-white text-gray-dark flex items-center justify-center transition-colors"
            aria-label="Next Brand"
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

