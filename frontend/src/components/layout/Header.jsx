import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menDropdownOpen, setMenDropdownOpen] = useState(false)
  const [womenDropdownOpen, setWomenDropdownOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenOpen, setMobileMenOpen] = useState(false)
  const [mobileWomenOpen, setMobileWomenOpen] = useState(false)

  return (
    <header className="bg-gray-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Left: Logo */}
        <a href="/" className="flex items-center">
          <div>
            <img
              src="/assets/images/template-white-logo.png"
              alt="TailStore Logo"
              className="h-14 w-auto mr-4"
            />
          </div>
        </a>

        {/* Hamburger menu button for mobile */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none p-2"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex md:flex-grow justify-center">
          <ul className="flex justify-center space-x-6 text-white items-center">
            <li>
              <a href="/" className="hover:text-primary font-semibold transition-colors">
                Home
              </a>
            </li>

            {/* Men Dropdown */}
            <li
              className="relative group"
              onMouseEnter={() => setMenDropdownOpen(true)}
              onMouseLeave={() => setMenDropdownOpen(false)}
            >
              <a
                href="#shop"
                className="hover:text-primary font-semibold flex items-center transition-colors py-2"
              >
                Men
                <i
                  className={`fas ${
                    menDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                  } ml-1 text-xs transition-transform`}
                ></i>
              </a>
              {menDropdownOpen && (
                <ul className="absolute left-0 bg-white text-black space-y-1 mt-1 p-2 rounded-lg shadow-xl min-w-44 z-50 border border-gray-line">
                  <li>
                    <a
                      href="#shop-men-1"
                      className="block px-4 py-2 hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
                    >
                      Men T-Shirts
                    </a>
                  </li>
                  <li>
                    <a
                      href="#shop-men-2"
                      className="block px-4 py-2 hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
                    >
                      Men Jackets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#shop-men-3"
                      className="block px-4 py-2 hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
                    >
                      Men Shoes
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Women Dropdown */}
            <li
              className="relative group"
              onMouseEnter={() => setWomenDropdownOpen(true)}
              onMouseLeave={() => setWomenDropdownOpen(false)}
            >
              <a
                href="#shop"
                className="hover:text-primary font-semibold flex items-center transition-colors py-2"
              >
                Women
                <i
                  className={`fas ${
                    womenDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                  } ml-1 text-xs transition-transform`}
                ></i>
              </a>
              {womenDropdownOpen && (
                <ul className="absolute left-0 bg-white text-black space-y-1 mt-1 p-2 rounded-lg shadow-xl min-w-44 z-50 border border-gray-line">
                  <li>
                    <a
                      href="#shop-women-1"
                      className="block px-4 py-2 hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
                    >
                      Women Dresses
                    </a>
                  </li>
                  <li>
                    <a
                      href="#shop-women-2"
                      className="block px-4 py-2 hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
                    >
                      Women Shirts
                    </a>
                  </li>
                  <li>
                    <a
                      href="#shop-women-3"
                      className="block px-4 py-2 hover:bg-primary hover:text-white rounded transition-colors text-sm font-medium"
                    >
                      Accessories
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a href="#shop" className="hover:text-primary font-semibold transition-colors">
                Shop
              </a>
            </li>
            <li>
              <a href="#product" className="hover:text-primary font-semibold transition-colors">
                Product
              </a>
            </li>
            <li>
              <a href="#404" className="hover:text-primary font-semibold transition-colors">
                404 page
              </a>
            </li>
            <li>
              <a href="#checkout" className="hover:text-primary font-semibold transition-colors">
                Checkout
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center space-x-4 relative">
          <a
            href="#register"
            className="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-1.5 rounded-full inline-block transition-colors text-sm"
          >
            Register
          </a>
          <a
            href="#login"
            className="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-1.5 rounded-full inline-block transition-colors text-sm"
          >
            Login
          </a>

          {/* Cart Icon & Dropdown */}
          <div
            className="relative cart-wrapper"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <a href="#cart" className="relative block p-1 group">
              <img
                src="/assets/images/cart-shopping.svg"
                alt="Cart"
                className="h-6 w-6 transition-transform group-hover:scale-110 filter brightness-0 invert"
              />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </a>

            {cartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl p-4 rounded-xl z-50 border border-gray-line">
                <div className="space-y-4">
                  {/* Cart Item 1 */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-line">
                    <div className="flex items-center">
                      <img
                        src="/assets/images/single-product/1.jpg"
                        alt="Product"
                        className="h-12 w-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-dark text-sm">Summer black dress</p>
                        <p className="text-xs text-gray-txt">Số lượng: 1</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary text-sm">$25.00</p>
                  </div>

                  {/* Cart Item 2 */}
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center">
                      <img
                        src="/assets/images/single-product/2.jpg"
                        alt="Product"
                        className="h-12 w-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-dark text-sm">Black suit</p>
                        <p className="text-xs text-gray-txt">Số lượng: 1</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary text-sm">$125.00</p>
                  </div>
                </div>

                <a
                  href="#cart"
                  className="block text-center mt-4 border border-primary bg-primary hover:bg-transparent text-white hover:text-primary py-2 rounded-full font-semibold transition-colors text-sm"
                >
                  Xem giỏ hàng
                </a>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:text-primary group p-1 transition-colors"
            aria-label="Search"
          >
            <img
              src="/assets/images/search-icon.svg"
              alt="Search"
              className="h-6 w-6 transition-transform group-hover:scale-110 filter brightness-0 invert"
            />
          </button>

          {/* Search Input Floating */}
          {searchOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white shadow-xl p-3 rounded-xl border border-gray-line search-slide-down z-50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-primary"
                />
                <button className="absolute right-3 text-gray-400 hover:text-primary">
                  <i className="fas fa-search text-sm"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="mobile-menu lg:hidden bg-gray-dark px-6 py-6 border-t border-gray-800 text-white">
          <ul className="space-y-3 text-center">
            <li>
              <a href="/" className="hover:text-primary font-bold block py-2">
                Home
              </a>
            </li>

            {/* Mobile Men Dropdown */}
            <li>
              <div
                onClick={() => setMobileMenOpen(!mobileMenOpen)}
                className="hover:text-primary font-bold py-2 flex justify-center items-center cursor-pointer select-none"
              >
                <span>Men</span>
                <i
                  className={`fas ${
                    mobileMenOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                  } text-xs ml-2`}
                ></i>
              </div>
              {mobileMenOpen && (
                <ul className="bg-gray-800 rounded-lg py-2 my-2 space-y-1">
                  <li>
                    <a href="#shop-men" className="hover:text-primary block py-1.5 text-sm">
                      Shop Men
                    </a>
                  </li>
                  <li>
                    <a href="#shop-men-1" className="hover:text-primary block py-1.5 text-sm">
                      Men Shirts
                    </a>
                  </li>
                  <li>
                    <a href="#shop-men-2" className="hover:text-primary block py-1.5 text-sm">
                      Men Jackets
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Mobile Women Dropdown */}
            <li>
              <div
                onClick={() => setMobileWomenOpen(!mobileWomenOpen)}
                className="hover:text-primary font-bold py-2 flex justify-center items-center cursor-pointer select-none"
              >
                <span>Women</span>
                <i
                  className={`fas ${
                    mobileWomenOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                  } text-xs ml-2`}
                ></i>
              </div>
              {mobileWomenOpen && (
                <ul className="bg-gray-800 rounded-lg py-2 my-2 space-y-1">
                  <li>
                    <a href="#shop-women" className="hover:text-primary block py-1.5 text-sm">
                      Shop Women
                    </a>
                  </li>
                  <li>
                    <a href="#shop-women-1" className="hover:text-primary block py-1.5 text-sm">
                      Women Dresses
                    </a>
                  </li>
                  <li>
                    <a href="#shop-women-2" className="hover:text-primary block py-1.5 text-sm">
                      Accessories
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a href="#shop" className="hover:text-primary font-bold block py-2">
                Shop
              </a>
            </li>
            <li>
              <a href="#product" className="hover:text-primary font-bold block py-2">
                Product
              </a>
            </li>
            <li>
              <a href="#404" className="hover:text-primary font-bold block py-2">
                404 page
              </a>
            </li>
            <li>
              <a href="#checkout" className="hover:text-primary font-bold block py-2">
                Checkout
              </a>
            </li>
          </ul>

          {/* Mobile Buttons */}
          <div className="flex flex-col mt-6 space-y-3 items-center">
            <a
              href="#register"
              className="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-6 py-2 rounded-full w-full text-center text-sm transition-colors"
            >
              Register
            </a>
            <a
              href="#login"
              className="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-6 py-2 rounded-full w-full text-center text-sm transition-colors"
            >
              Login
            </a>
            <a
              href="#cart"
              className="bg-transparent hover:bg-primary text-white border border-gray-500 font-semibold px-6 py-2 rounded-full w-full text-center text-sm transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-shopping-cart"></i> Giỏ hàng (2 sản phẩm)
            </a>
          </div>

          {/* Mobile Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </nav>
      )}
    </header>
  )
}

