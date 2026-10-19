import { useState } from 'react'
import ProductCard from '../components/ProductCard'

const initialProducts = [
  {
    id: 1,
    title: 'Summer black dress',
    category: 'Women',
    price: '19.99',
    originalPrice: '24.99',
    image: '/assets/images/products/1.jpg',
  },
  {
    id: 2,
    title: 'Black suit',
    category: 'Women',
    price: '29.99',
    originalPrice: null,
    image: '/assets/images/products/2.jpg',
  },
  {
    id: 3,
    title: 'Black long dress',
    category: 'Women',
    price: '15.99',
    originalPrice: '19.99',
    image: '/assets/images/products/3.jpg',
  },
  {
    id: 4,
    title: 'Black leather jacket',
    category: 'Women',
    price: '39.99',
    originalPrice: '49.99',
    image: '/assets/images/products/4.jpg',
  },
  {
    id: 5,
    title: "Blue women's suit",
    category: 'Women',
    price: '19.99',
    originalPrice: '24.99',
    image: '/assets/images/products/5.jpg',
  },
  {
    id: 6,
    title: 'White shirt with long sleeves',
    category: 'Women',
    price: '29.99',
    originalPrice: null,
    image: '/assets/images/products/6.jpg',
  },
  {
    id: 7,
    title: "Yellow men's suit",
    category: 'Men',
    price: '15.99',
    originalPrice: '19.99',
    image: '/assets/images/products/7.jpg',
  },
  {
    id: 8,
    title: 'Red dress',
    category: 'Women',
    price: '39.99',
    originalPrice: '49.99',
    image: '/assets/images/products/8.jpg',
  },
]

export default function Shop() {
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [onlySale, setOnlySale] = useState(false)
  const [sortBy, setSortBy] = useState('latest')

  const filteredProducts = initialProducts.filter((item) => {
    if (onlySale && !item.originalPrice) return false
    return true
  })

  return (
    <section id="shop" className="py-8 bg-gray-lighter min-h-screen">
      <div className="container mx-auto px-4">
        {/* Top Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 bg-white px-6 rounded-2xl shadow-sm mb-6 gap-4">
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <button
              onClick={() => setOnlySale(!onlySale)}
              className={`py-2 px-5 rounded-full text-sm font-semibold transition-colors ${
                onlySale
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Show On Sale
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`py-2 px-5 rounded-full text-sm font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-th mr-1.5"></i> Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`py-2 px-5 rounded-full text-sm font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-bars mr-1.5"></i> List View
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-txt">Sắp xếp:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 hover:border-primary px-4 py-2 rounded-full text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="latest">Mới nhất (Latest)</option>
              <option value="popular">Phổ biến (Popularity)</option>
              <option value="az">Tên A-Z</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="block md:hidden text-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-primary text-white py-2 px-6 rounded-full text-sm font-semibold shadow"
          >
            {showFilters ? 'Ẩn bộ lọc (Hide Filters)' : 'Hiện bộ lọc (Show Filters)'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar Filters */}
          <div
            className={`w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-sm border border-gray-line ${
              showFilters ? 'block' : 'hidden md:block'
            }`}
          >
            {/* Category Filter */}
            <div className="mb-6 pb-6 border-b border-gray-line">
              <h3 className="text-base font-bold text-gray-dark mb-4">Danh mục</h3>
              <div className="space-y-2.5 text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">T-Shirts</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Hoodies</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Accessories</span>
                </label>
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6 pb-6 border-b border-gray-line">
              <h3 className="text-base font-bold text-gray-dark mb-4">Kích thước (Size)</h3>
              <div className="space-y-2.5 text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">S (30)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">M (44)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">L (22)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">XL (18)</span>
                </label>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6 pb-6 border-b border-gray-line">
              <h3 className="text-base font-bold text-gray-dark mb-4">Thương hiệu</h3>
              <div className="space-y-2.5 text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Nike</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Adidas</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Puma</span>
                </label>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-base font-bold text-gray-dark mb-4">Mức giá</h3>
              <div className="space-y-2.5 text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Dưới $20</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">$20 - $50</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="ml-2.5 text-gray-700">Trên $50</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products List Area */}
          <div className="w-full md:w-3/4">
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

