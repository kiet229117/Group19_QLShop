import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ShopStateProvider } from '../../../features/shop/shared/context/ShopStateContext';

/**
 * Layout tổng của Client Shop.
 * Bọc `ShopStateProvider` để toàn bộ trang Shop chia sẻ state giỏ hàng, đơn hàng và hồ sơ cục bộ
 * mà không thực hiện bất kỳ HTTP request nào và không can thiệp vào AdminLayout.
 */
export default function ShopLayout({ children }) {
  return (
    <ShopStateProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50/50 text-zinc-900 antialiased">
        <Header />
        <main className="flex-1">{children || <Outlet />}</main>
        <Footer />
      </div>
    </ShopStateProvider>
  );
}
