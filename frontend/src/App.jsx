import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './features/home/page/Home'
import Shop from './features/products/page/Shop'
import ProductDetail from './features/products/page/ProductDetail'
import Cart from './features/cart/page/Cart'
import Checkout from './features/checkout/page/Checkout'
import Register from './features/auth/page/Register'
import NotFound from './features/notfound/page/NotFound'

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home')

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Simple client-side page routing based on hash
  const renderCurrentPage = () => {
    if (currentHash.startsWith('#shop')) {
      return <Shop />
    }
    if (currentHash.startsWith('#product')) {
      return <ProductDetail />
    }
    if (currentHash === '#cart') {
      return <Cart />
    }
    if (currentHash === '#checkout') {
      return <Checkout />
    }
    if (currentHash === '#login' || currentHash === '#register') {
      return <Register />
    }
    if (currentHash === '#404') {
      return <NotFound onGoHome={() => (window.location.hash = '#home')} />
    }
    return <Home />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation Header */}
      <Header />

      {/* Dynamic Page View */}
      <div className="flex-grow">{renderCurrentPage()}</div>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

export default App
