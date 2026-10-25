import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Settings2,
  KeyRound,
  CreditCard,
  Truck,
  Bell,
  Webhook
} from 'lucide-react';
import { toast } from '../../../components/common/Toast';

export const tabs = [
  { id: 'general', label: 'Cấu hình Chung (General)', icon: Settings2 },
  { id: 'access', label: 'Phân quyền & Tài khoản', icon: KeyRound },
  { id: 'payments', label: 'Thanh toán & Tiền tệ', icon: CreditCard },
  { id: 'shipping', label: 'Vận chuyển & Kho hàng', icon: Truck },
  { id: 'notifications', label: 'Email & Thông báo', icon: Bell },
  { id: 'integrations', label: 'API & Tích hợp', icon: Webhook }
];

export const defaultSettings = {
  storeName: 'QLShop - Thời Trang Áo Nam Nữ ',
  currency: 'VND (Việt Nam Đồng - đ)',
  exchangeRate: 'Cập nhật mỗi 6 giờ (Vietcombank API)',
  hotline: '1900 8989 (8:00 - 22:00)',
  supportEmail: 'support@shopao.com',
  address: '128 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  autoCancelHours: '24',
  lowStockLimit: '20',
  voucherStacking: 'standard',
  rewardsEnabled: true,
  rewardRate: '10,000',
  rewardValue: '1',
  loginTimeout: '4 giờ không hoạt động',
  twoFactor: true
};

export default function useSettings() {
  const location = useLocation();
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('qlshop_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const currentTab = location.pathname.split('/').filter(Boolean).at(-1);
  const activeTab = tabs.some((tab) => tab.id === currentTab) ? currentTab : 'general';

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('qlshop_settings', JSON.stringify(settings));
      toast.success('Đã lưu cấu hình hệ thống QLShop thành công!');
    } catch (err) {
      toast.error('Không thể lưu cấu hình');
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('qlshop_settings');
    toast.info('Đã khôi phục cấu hình mặc định ban đầu');
  };

  return {
    settings,
    setSettings,
    activeTab,
    tabs,
    update,
    saveSettings,
    resetSettings
  };
}

