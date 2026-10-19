import { useState } from 'react'

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'cod',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Đặt hàng thành công! Cảm ơn bạn ${formData.name}.`)
  }

  return (
    <section id="checkout-page" className="bg-gray-lighter py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-dark mb-8">Thanh toán (Checkout)</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Billing Form Left */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-line p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-dark mb-6 pb-3 border-b border-gray-line">
              Thông tin giao hàng
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-dark mb-1">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-dark mb-1">Địa chỉ giao hàng *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường, phường/xã"
                  className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-dark mb-1">Tỉnh / Thành phố *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Hà Nội, TP.HCM, ..."
                  className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-dark mt-8 mb-4 pb-3 border-b border-gray-line">
              Phương thức thanh toán
            </h2>

            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="accent-primary"
                />
                <span className="ml-3 text-sm font-semibold text-gray-dark">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleChange}
                  className="accent-primary"
                />
                <span className="ml-3 text-sm font-semibold text-gray-dark">Chuyển khoản ngân hàng / VNPay / MoMo</span>
              </label>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-line p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-dark mb-4 pb-3 border-b border-gray-line">
                Đơn hàng của bạn
              </h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-txt">
                  <span>Summer black dress × 1</span>
                  <span className="font-semibold text-gray-dark">$19.99</span>
                </div>
                <div className="flex justify-between text-gray-txt">
                  <span>Black suit × 1</span>
                  <span className="font-semibold text-gray-dark">$29.99</span>
                </div>
                <div className="border-t border-gray-line pt-3 flex justify-between text-gray-txt">
                  <span>Phí ship</span>
                  <span className="font-semibold text-gray-dark">$5.00</span>
                </div>
                <div className="border-t border-gray-line pt-3 flex justify-between text-lg font-bold text-gray-dark">
                  <span>Tổng thanh toán</span>
                  <span className="text-primary">$54.98</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-transparent border border-primary text-white hover:text-primary font-bold py-3.5 px-6 rounded-full transition-all duration-200 text-sm shadow-md"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

