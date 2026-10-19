import ProductCard from '../../products/components/ProductCard'

const popularProducts = [
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
    category: 'Women, Accessories',
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
]

export default function PopularProducts() {
  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.title}" vào giỏ hàng!`)
  }

  return (
    <section id="popular-products" className="py-10 bg-gray-lighter">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-dark">
              Popular products
            </h2>
            <p className="text-sm text-gray-txt mt-1">
              Top trending items loved by our community
            </p>
          </div>
          <a
            href="#shop"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả <i className="fas fa-arrow-right text-xs"></i>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

