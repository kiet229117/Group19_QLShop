import { useState } from 'react';
import { MapPin, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ShopInput from '../../../../components/shop/common/ShopInput';
import { useShopState } from '../../shared/context/ShopStateContext';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileForm from '../components/ProfileForm';

/**
 * Trang Hồ sơ cá nhân (`/shop/profile`).
 * Không yêu cầu đăng nhập thật và không gọi API.
 */
export default function ProfilePage() {
  const {
    profile,
    orders,
    updateProfileSimulated,
    demoSignedIn,
    setDemoSignedIn,
  } = useShopState();

  const [activeSection, setActiveSection] = useState('info');
  const [signOutNotice, setSignOutNotice] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Địa chỉ mới');
  const [newAddressText, setNewAddressText] = useState('');

  const handleToggleSignOut = () => {
    const next = !demoSignedIn;
    setDemoSignedIn(next);
    setSignOutNotice(
      next
        ? 'Đã bật lại trạng thái tài khoản mẫu trên giao diện.'
        : 'Bạn vừa thực hiện Đăng xuất mô phỏng trên giao diện (không gọi API Backend).'
    );
  };

  const handleSetDefaultAddress = (addr) => {
    const updatedList = (profile.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addr.id,
    }));
    updateProfileSimulated({
      defaultAddress: addr.address,
      addresses: updatedList,
    });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;
    const newItem = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel.trim() || 'Địa chỉ khác',
      recipientName: profile.fullname,
      phone: profile.phone,
      address: newAddressText.trim(),
      isDefault: false,
    };
    updateProfileSimulated({
      addresses: [...(profile.addresses || []), newItem],
    });
    setNewAddressText('');
    setAddingAddress(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Hồ sơ cá nhân' }]} />

      {signOutNotice && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <span>{signOutNotice}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <ProfileSidebar
            profile={profile}
            activeSection={activeSection}
            ordersCount={orders.length}
            demoSignedIn={demoSignedIn}
            onSelectSection={setActiveSection}
            onToggleDemoSignOut={handleToggleSignOut}
          />
        </div>

        <div className="space-y-6 lg:col-span-8">
          {activeSection === 'info' ? (
            <ProfileForm profile={profile} onSave={updateProfileSimulated} />
          ) : (
            /* Quản lý sổ địa chỉ giao hàng cục bộ */
            <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900">
                    Sổ địa chỉ giao hàng
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Các địa chỉ dùng để điền nhanh khi thanh toán đơn hàng.
                  </p>
                </div>
                <ShopButton
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingAddress((v) => !v)}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Thêm địa chỉ mới
                </ShopButton>
              </div>

              {addingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4"
                >
                  <ShopInput
                    label="Nhãn địa chỉ (VD: Nhà riêng, Công ty)"
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                  />
                  <ShopInput
                    label="Địa chỉ chi tiết (*)"
                    icon={MapPin}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <ShopButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingAddress(false)}
                    >
                      Hủy
                    </ShopButton>
                    <ShopButton type="submit" variant="primary" size="sm">
                      Lưu địa chỉ (Mô phỏng)
                    </ShopButton>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {(profile.addresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 ${
                      addr.isDefault
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-zinc-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-bold text-white">
                          {addr.label}
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {addr.recipientName}
                        </span>
                        <span className="text-xs text-zinc-500">• {addr.phone}</span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600">{addr.address}</p>
                    </div>

                    {!addr.isDefault && (
                      <ShopButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultAddress(addr)}
                      >
                        Đặt làm mặc định
                      </ShopButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
