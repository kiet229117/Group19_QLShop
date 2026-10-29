import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { MapPin, Plus, CheckCircle2, LogIn, Trash2 } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ShopInput from '../../../../components/shop/common/ShopInput';
import AddressAutocompleteInput from '../../../../components/shop/common/AddressAutocompleteInput';
import { useShopState } from '../../shared/context/ShopStateContext';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import { validateShippingAddress } from '../../shared/utils/addressUtils';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileForm from '../components/ProfileForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

/**
 * Trang Hồ sơ cá nhân (`/shop/profile`).
 * Kết nối xác thực thật và đồng bộ API Authentication
 */
export default function ProfilePage() {
  const { profile, orders, updateProfile } = useShopState();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const [activeSection, setActiveSection] = useState(
    tabParam === 'addresses' || tabParam === 'password' ? tabParam : 'info'
  );

  useEffect(() => {
    if (tabParam === 'addresses' || tabParam === 'password') {
      setActiveSection(tabParam);
    } else if (!tabParam) {
      setActiveSection('info');
    }
  }, [tabParam]);

  const handleSelectSection = (sectionKey) => {
    setActiveSection(sectionKey);
    if (sectionKey === 'info') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: sectionKey });
    }
  };

  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Nhà riêng');
  const [newAddressText, setNewAddressText] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất tài khoản thành công.');
    } catch {
      toast.error('Có lỗi khi đăng xuất');
    }
  };

  const handleSetDefaultAddress = async (addr) => {
    const updatedList = (profile.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addr.id,
    }));
    await updateProfile({
      defaultAddress: addr.address,
      addresses: updatedList,
    });
    toast.success(`Đã đặt "${addr.address}" làm địa chỉ giao hàng mặc định!`);
  };

  const handleDeleteAddress = async (addrId) => {
    const target = (profile.addresses || []).find((a) => a.id === addrId);
    if (target?.isDefault) {
      toast.warning('Không thể xóa địa chỉ mặc định. Vui lòng chọn địa chỉ khác làm mặc định trước!');
      return;
    }
    const updatedList = (profile.addresses || []).filter((a) => a.id !== addrId);
    await updateProfile({
      addresses: updatedList,
    });
    toast.info('Đã xóa địa chỉ khỏi sổ địa chỉ.');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const cleanText = newAddressText.trim();
    const err = validateShippingAddress(cleanText);
    if (err) {
      toast.error(err);
      return;
    }

    const isFirst = !profile.defaultAddress || (profile.addresses || []).length === 0;
    const shouldBeDefault = makeDefault || isFirst;

    const newItem = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel.trim() || 'Nhà riêng',
      recipientName: profile.fullname || profile.name || 'Khách hàng',
      phone: profile.phone || '',
      address: cleanText,
      isDefault: shouldBeDefault,
    };

    const filteredExisting = (profile.addresses || []).filter(
      (a) => a.address.toLowerCase() !== cleanText.toLowerCase()
    );

    const updatedList = shouldBeDefault
      ? filteredExisting.map((a) => ({ ...a, isDefault: false })).concat(newItem)
      : [...filteredExisting, newItem];

    await updateProfile({
      ...(shouldBeDefault ? { defaultAddress: cleanText } : {}),
      addresses: updatedList,
    });

    setNewAddressText('');
    setNewAddressLabel('Nhà riêng');
    setMakeDefault(false);
    setAddingAddress(false);
    toast.success(
      shouldBeDefault
        ? 'Đã lưu địa chỉ vào cơ sở dữ liệu và đặt làm mặc định!'
        : 'Đã lưu địa chỉ giao hàng mới vào sổ địa chỉ!'
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Hồ sơ cá nhân' }]} />

      {!isAuthenticated && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-xs sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-emerald-900">
              Bạn chưa đăng nhập tài khoản QLShop
            </h3>
            <p className="text-xs text-emerald-700">
              Đăng nhập để xem lịch sử đơn hàng thực tế, lưu danh sách yêu thích và bảo mật tài khoản.
            </p>
          </div>
          <Link
            to="/login"
            state={{ from: location }}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-600"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập ngay
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <ProfileSidebar
            profile={profile}
            activeSection={activeSection}
            ordersCount={orders.length}
            demoSignedIn={isAuthenticated}
            onSelectSection={handleSelectSection}
            onToggleDemoSignOut={handleSignOut}
          />
        </div>

        <div className="space-y-6 lg:col-span-8">
          {activeSection === 'info' && (
            <ProfileForm profile={profile} onSave={updateProfile} />
          )}

          {activeSection === 'addresses' && (
            <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900">
                    Sổ địa chỉ giao hàng
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Các địa chỉ dùng để điền nhanh khi thanh toán đơn hàng (đồng bộ với cơ sở dữ liệu).
                  </p>
                </div>
                <ShopButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAddingAddress((v) => !v);
                    setMakeDefault(!profile.defaultAddress || (profile.addresses || []).length === 0);
                  }}
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
                  <AddressAutocompleteInput
                    label="Địa chỉ chi tiết (*)"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                  />

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={makeDefault}
                      onChange={(e) => setMakeDefault(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-semibold text-zinc-700">
                      Đặt làm địa chỉ nhận hàng mặc định (đồng bộ vào Hồ sơ & Cơ sở dữ liệu)
                    </span>
                  </label>

                  <div className="flex justify-end gap-2 pt-1">
                    <ShopButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingAddress(false)}
                    >
                      Hủy
                    </ShopButton>
                    <ShopButton type="submit" variant="primary" size="sm">
                      Lưu địa chỉ
                    </ShopButton>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {(profile.addresses || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center">
                    <MapPin className="mx-auto h-8 w-8 text-zinc-300" />
                    <p className="mt-2 text-sm font-bold text-zinc-800">
                      Chưa có địa chỉ giao hàng nào
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Thêm địa chỉ giao hàng để đặt hàng nhanh chóng mà không cần nhập lại.
                    </p>
                    <ShopButton
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setAddingAddress(true);
                        setMakeDefault(true);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Thêm địa chỉ ngay
                    </ShopButton>
                  </div>
                ) : (
                  (profile.addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                        addr.isDefault
                          ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20'
                          : 'border-zinc-200 hover:border-zinc-300'
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
                          {addr.phone && (
                            <span className="text-xs text-zinc-500">• {addr.phone}</span>
                          )}
                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600">{addr.address}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <ShopButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefaultAddress(addr)}
                          >
                            Đặt làm mặc định
                          </ShopButton>
                        )}
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="rounded-xl border border-zinc-200 p-2 text-zinc-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                            title="Xóa địa chỉ này"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === 'password' && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}
