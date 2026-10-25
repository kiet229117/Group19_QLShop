import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ShopStateProvider } from '../../../features/shop/shared/context/ShopStateContext';
import ShopChatWidget from '../../../features/shop/chat/components/ShopChatWidget';

/**
 * Layout tổng của Client Shop.
 * Tích hợp sẵn `ShopChatWidget` nổi góc dưới màn hình giúp khách hàng nhắn tin với chủ shop CSKH 24/7.
 */
export default function ShopLayout({ children }) {
  return (
    <ShopStateProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50/50 text-zinc-900 antialiased">
        <Header />
        <main className="flex-1">{children || <Outlet />}</main>
        <Footer />
        {/* Nút & Cửa sổ Chat trực tuyến với CSKH chủ shop */}
        <ShopChatWidget />
      </div>
    </ShopStateProvider>
  );
}
