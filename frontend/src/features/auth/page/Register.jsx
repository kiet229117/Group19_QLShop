import { useState } from 'react'

export default function Register() {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regConfirmPass, setRegConfirmPass] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    alert(`Đăng nhập thành công với: ${loginEmail}`)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (regPass !== regConfirmPass) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    alert(`Đăng ký thành công cho tài khoản: ${regEmail}`)
  }

  return (
    <section id="register-login-page" className="bg-gray-lighter py-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-line p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-dark mb-6">
                Đăng nhập (Login)
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-txt pt-1">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="custom-checkbox" />
                    <span className="ml-2">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#forgot" className="text-primary hover:underline font-semibold">
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-transparent border border-primary text-white hover:text-primary font-bold py-3 rounded-full transition-all duration-200 text-sm shadow-md mt-4"
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-line p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-dark mb-6">
                Tạo tài khoản (Register)
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-dark mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-transparent border border-primary text-white hover:text-primary font-bold py-3 rounded-full transition-all duration-200 text-sm shadow-md mt-4"
                >
                  Đăng ký tài khoản
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

