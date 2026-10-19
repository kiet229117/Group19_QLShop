const categories = [
  {
    id: 1,
    title: 'Men',
    image: '/assets/images/cat-image1.jpg',
    link: '#shop-men',
  },
  {
    id: 2,
    title: 'Women',
    image: '/assets/images/cat-image4.jpg',
    link: '#shop-women',
  },
  {
    id: 3,
    title: 'Accessories',
    image: '/assets/images/cat-image5.jpg',
    link: '#shop-accessories',
  },
]

export default function CategoryBanners() {
  return (
    <section id="product-banners" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3] bg-gray-100"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gray-dark/40 group-hover:bg-gray-dark/50 transition-colors duration-300"></div>

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow">
                  {cat.title}
                </h2>
                <a
                  href={cat.link}
                  className="bg-primary hover:bg-transparent border border-transparent hover:border-white text-white font-semibold px-6 py-2.5 rounded-full inline-block transition-all duration-300 text-sm shadow-md"
                >
                  Shop now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

