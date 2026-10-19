export default function ProductCard({
  id,
  image,
  title,
  category,
  price,
  originalPrice,
  onAddToCart,
}) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full border border-gray-100 group">
      <div>
        <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-50 aspect-square flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {originalPrice && (
            <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              Sale
            </span>
          )}
        </div>

        <a
          href={`#product-${id || 1}`}
          className="text-base md:text-lg font-semibold text-gray-dark hover:text-primary transition-colors line-clamp-1 block mb-1"
        >
          {title}
        </a>

        <p className="text-xs text-gray-txt uppercase tracking-wide font-medium mb-3">
          {category}
        </p>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <span className="text-lg font-bold text-primary">${price}</span>
          {originalPrice && (
            <span className="text-sm line-through text-gray-400 ml-2">
              ${originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart({ id, title, price, image })}
          className="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full transition-all duration-200 text-sm shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

