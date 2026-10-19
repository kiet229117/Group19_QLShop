import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 4000)
    }
  }

  return (
    <section id="subscribe" className="py-16 lg:py-20 bg-white border-t border-gray-line">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-dark">
              Join our newsletter and{' '}
              <span className="text-primary">get $50 discount</span> for your first order
            </h2>
            <p className="text-sm text-gray-txt mt-3">
              Đăng ký để nhận sớm nhất các bộ sưu tập giới hạn và mã giảm giá độc quyền.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-full text-sm font-medium border border-emerald-200">
                🎉 Cảm ơn bạn đã đăng ký! Mã giảm giá $50 đã được gửi đến email của bạn.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full flex-1 rounded-full px-5 py-3 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary text-sm shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold py-3 px-7 rounded-full transition-all duration-200 text-sm whitespace-nowrap shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

