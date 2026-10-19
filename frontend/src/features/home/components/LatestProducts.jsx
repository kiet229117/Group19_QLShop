import ProductCard from '../../products/components/ProductCard'

const latestProducts = [
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

export default function LatestProducts() {
  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.title}" vào giỏ hàng!`)
  }

  return (
    <section id="latest-products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-dark">
              Latest products
            </h2>
            <p className="text-sm text-gray-txt mt-1">
              Fresh additions to elevate your everyday wardrobe
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
          {latestProducts.map((product) => (
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

