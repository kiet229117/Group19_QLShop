import { useState } from 'react'

const gallery = [
  '/assets/images/single-product/1.jpg',
  '/assets/images/single-product/2.jpg',
  '/assets/images/single-product/3.jpg',
  '/assets/images/single-product/4.jpg',
  '/assets/images/single-product/5.jpg',
]

export default function ProductDetail() {
  const [selectedImg, setSelectedImg] = useState(gallery[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeTab, setActiveTab] = useState('desc')

  return (
    <div className="bg-gray-lighter min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm font-semibold text-gray-txt mb-6 flex items-center space-x-2">
          <a href="/" className="hover:text-primary">Home</a>
          <span>&gt;</span>
          <a href="#shop" className="hover:text-primary">Shop</a>
          <span>&gt;</span>
          <span className="text-gray-dark">Summer Black Dress</span>
        </nav>

        {/* Product Info Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-line p-6 md:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery Left */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-line">
                <img
                  src={selectedImg}
                  alt="Product view"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info Right */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Women Collection
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-dark mb-4">
                  Summer Black Dress
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex text-amber-400 text-sm">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <span className="text-sm font-semibold text-gray-txt">(128 reviews)</span>
                  <span className="text-sm text-emerald-600 font-semibold">• Còn hàng (In Stock)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-4 mb-6">
                  <span className="text-3xl font-extrabold text-primary">$25.00</span>
                  <span className="text-lg line-through text-gray-400">$35.00</span>
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full">
                    Tiết kiệm 28%
                  </span>
                </div>

                <p className="text-gray-txt text-sm leading-relaxed mb-8">
                  Chiếc váy mùa hè với chất vải mềm mại, thoáng mát tôn vinh nét quyến rũ, hiện đại. Thích hợp cho cả đi chơi, dạo phố và các buổi tiệc nhẹ.
                </p>

                {/* Sizes */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-dark mb-2">Chọn kích cỡ (Size):</label>
                  <div className="flex space-x-3">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-11 rounded-xl text-sm font-bold border transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                  <div className="flex items-center border border-gray-300 rounded-full bg-white px-2 py-1 w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-gray-dark">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => alert(`Đã thêm ${quantity} sản phẩm (Size ${selectedSize}) vào giỏ hàng!`)}
                    className="flex-1 bg-primary hover:bg-transparent border border-primary hover:border-primary text-white hover:text-primary font-bold py-3.5 px-8 rounded-full transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-shopping-bag"></i> Thêm vào giỏ hàng
                  </button>
                </div>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-line text-xs text-gray-txt">
                <div className="flex items-center gap-2">
                  <i className="fas fa-truck text-primary"></i> Giao hàng toàn quốc 2-3 ngày
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-primary"></i> Đổi trả miễn phí 30 ngày
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Sections */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-line p-6 md:p-10">
          <div className="flex border-b border-gray-line gap-8 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-base font-bold transition-colors relative ${
                activeTab === 'desc' ? 'text-primary' : 'text-gray-400 hover:text-gray-dark'
              }`}
            >
              Mô tả chi tiết
              {activeTab === 'desc' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-base font-bold transition-colors relative ${
                activeTab === 'specs' ? 'text-primary' : 'text-gray-400 hover:text-gray-dark'
              }`}
            >
              Thông số & Chất liệu
              {activeTab === 'specs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-base font-bold transition-colors relative ${
                activeTab === 'reviews' ? 'text-primary' : 'text-gray-400 hover:text-gray-dark'
              }`}
            >
              Đánh giá (128)
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          <div className="text-sm text-gray-txt leading-relaxed">
            {activeTab === 'desc' && (
              <p>
                Sản phẩm được thiết kế theo xu hướng hiện đại, tôn vinh dáng vẻ thanh lịch của phụ nữ Á Đông. Chất vải cotton pha lanh cao cấp giúp thấm hút mồ hôi tối ưu, đem lại cảm giác tự tin suốt ngày dài.
              </p>
            )}
            {activeTab === 'specs' && (
              <ul className="list-disc pl-5 space-y-2">
                <li>Chất liệu: 80% Cotton, 20% Polyester</li>
                <li>Màu sắc: Đen thanh lịch</li>
                <li>Xuất xứ: Việt Nam</li>
                <li>Hướng dẫn giặt: Giặt máy chế độ nhẹ, không dùng thuốc tẩy mạnh</li>
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-dark">Nguyễn Thị H.</span>
                    <span className="text-amber-400 text-xs">★★★★★</span>
                  </div>
                  <p className="text-xs text-gray-txt">Váy rất đẹp, form chuẩn y như hình, vải mát và giao hàng cực nhanh!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

