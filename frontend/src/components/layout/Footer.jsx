export default function Footer() {
  return (
    <footer className="border-t border-gray-line bg-white">
      {/* Top section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Menu 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-dark">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-txt">
              <li>
                <a href="#shop" className="hover:text-primary transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#women" className="hover:text-primary transition-colors">
                  Women
                </a>
              </li>
              <li>
                <a href="#men" className="hover:text-primary transition-colors">
                  Men
                </a>
              </li>
              <li>
                <a href="#shoes" className="hover:text-primary transition-colors">
                  Shoes
                </a>
              </li>
              <li>
                <a href="#accessories" className="hover:text-primary transition-colors">
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* Menu 2 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-dark">Pages</h3>
            <ul className="space-y-2 text-sm text-gray-txt">
              <li>
                <a href="#shop" className="hover:text-primary transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#product" className="hover:text-primary transition-colors">
                  Product
                </a>
              </li>
              <li>
                <a href="#checkout" className="hover:text-primary transition-colors">
                  Checkout
                </a>
              </li>
              <li>
                <a href="#404" className="hover:text-primary transition-colors">
                  404 Page
                </a>
              </li>
            </ul>
          </div>

          {/* Menu 3 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-dark">Account</h3>
            <ul className="space-y-2 text-sm text-gray-txt">
              <li>
                <a href="#cart" className="hover:text-primary transition-colors">
                  Cart
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-primary transition-colors">
                  Registration
                </a>
              </li>
              <li>
                <a href="#login" className="hover:text-primary transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-dark">Follow Us</h3>
            <ul className="space-y-2.5 text-sm text-gray-txt">
              <li className="flex items-center">
                <img
                  src="/assets/images/social_icons/facebook.svg"
                  alt="Facebook"
                  className="w-4 h-4 transition-transform transform hover:scale-110 mr-2.5"
                />
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li className="flex items-center">
                <img
                  src="/assets/images/social_icons/twitter.svg"
                  alt="Twitter"
                  className="w-4 h-4 transition-transform transform hover:scale-110 mr-2.5"
                />
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
              <li className="flex items-center">
                <img
                  src="/assets/images/social_icons/instagram.svg"
                  alt="Instagram"
                  className="w-4 h-4 transition-transform transform hover:scale-110 mr-2.5"
                />
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li className="flex items-center">
                <img
                  src="/assets/images/social_icons/pinterest.svg"
                  alt="Pinterest"
                  className="w-4 h-4 transition-transform transform hover:scale-110 mr-2.5"
                />
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Pinterest
                </a>
              </li>
              <li className="flex items-center">
                <img
                  src="/assets/images/social_icons/youtube.svg"
                  alt="YouTube"
                  className="w-4 h-4 transition-transform transform hover:scale-110 mr-2.5"
                />
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-dark">Contact Us</h3>
            <img
              src="/assets/images/template-logo.png"
              alt="TailStore"
              className="h-12 mb-4 object-contain"
            />
            <p className="text-sm text-gray-txt">123 Street Name, Paris, France</p>
            <p className="text-lg font-bold text-gray-dark my-3">Phone: (123) 456-7890</p>
            <a
              href="mailto:info@company.com"
              className="text-sm text-gray-txt underline hover:text-primary transition-colors"
            >
              Email: info@company.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="py-6 border-t border-gray-line bg-gray-lighter">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div className="w-full lg:w-3/4 text-center lg:text-left">
            <p className="mb-2 text-sm font-semibold text-gray-txt">
              &copy; 2024 Your Company. All rights reserved.
            </p>
            <ul className="flex justify-center lg:justify-start space-x-4 text-xs text-gray-txt">
              <li>
                <a href="#privacy" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>•</li>
              <li>
                <a href="#terms" className="hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>•</li>
              <li>
                <a href="#faq" className="hover:text-primary">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Icons */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end items-center gap-3">
            <img
              src="/assets/images/social_icons/paypal.svg"
              alt="PayPal"
              className="h-7 w-auto hover:opacity-80 transition-opacity"
            />
            <img
              src="/assets/images/social_icons/stripe.svg"
              alt="Stripe"
              className="h-7 w-auto hover:opacity-80 transition-opacity"
            />
            <img
              src="/assets/images/social_icons/visa.svg"
              alt="Visa"
              className="h-7 w-auto hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

