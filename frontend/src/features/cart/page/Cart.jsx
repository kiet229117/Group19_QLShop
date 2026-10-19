import { useState } from 'react'

const initialCart = [
  {
    id: 1,
    title: 'Summer black dress',
    price: 19.99,
    quantity: 1,
    image: '/assets/images/single-product/1.jpg',
  },
  {
    id: 2,
    title: 'Black suit',
    price: 29.99,
    quantity: 2,
    image: '/assets/images/single-product/2.jpg',
  },
]

export default function Cart() {
  const [items, setItems] = useState(initialCart)

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta
            return newQ > 0 ? { ...item, quantity: newQ } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = items.length > 0 ? 5.0 : 0
  const total = subtotal + shipping

  return (
    <section id="cart-page" className="bg-gray-lighter py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-dark mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-bold text-gray-dark mb-2">Giỏ hàng đang trống</h2>
            <p className="text-sm text-gray-txt mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <a
              href="#shop"
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full inline-block shadow-md hover:bg-transparent hover:text-primary border border-primary transition-colors text-sm"
            >
              Tiếp tục mua sắm
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Table */}
            <div className="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-gray-line p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-line text-sm text-gray-txt pb-4">
                      <th className="py-3 font-semibold">Sản phẩm</th>
                      <th className="py-3 font-semibold text-center">Đơn giá</th>
                      <th className="py-3 font-semibold text-center">Số lượng</th>
                      <th className="py-3 font-semibold text-right">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-line last:border-b-0">
                        <td className="py-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-20 w-20 object-cover rounded-xl bg-gray-50 border border-gray-line"
                            />
                            <div>
                              <p className="font-bold text-gray-dark text-base">{item.title}</p>
                              <button
                                onClick={() => updateQuantity(item.id, -item.quantity)}
                                className="text-xs text-red-500 hover:underline mt-1"
                              >
                                Xóa sản phẩm
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center font-semibold text-sm">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center border border-gray-300 rounded-full px-2 py-1 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-right font-bold text-primary text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-line p-6">
                <h2 className="text-xl font-bold text-gray-dark mb-4 pb-3 border-b border-gray-line">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 text-sm text-gray-txt mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="font-semibold text-gray-dark">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-gray-dark">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-line pt-3 flex justify-between text-base font-bold text-gray-dark">
                    <span>Tổng cộng:</span>
                    <span className="text-primary text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <a
                  href="#checkout"
                  className="block text-center bg-primary hover:bg-transparent border border-primary text-white hover:text-primary font-bold py-3.5 px-6 rounded-full transition-all duration-200 text-sm shadow-md"
                >
                  Tiến hành thanh toán
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

