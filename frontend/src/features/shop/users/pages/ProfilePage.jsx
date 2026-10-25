import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Plus, CheckCircle2, Lock, LogIn, KeyRound, RefreshCw, AlertCircle } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopButton from '../../../../components/shop/common/ShopButton';
import ShopInput from '../../../../components/shop/common/ShopInput';
import { useShopState } from '../../shared/context/ShopStateContext';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileForm from '../components/ProfileForm';

/**
 * Trang Hồ sơ cá nhân (`/shop/profile`).
 * Kết nối xác thực thật và đồng bộ API Authentication
 */
export default function ProfilePage() {
  const { profile, orders, updateProfileSimulated } = useShopState();
  const { isAuthenticated, logout, changePassword } = useAuth();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState('info');
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Địa chỉ mới');
  const [newAddressText, setNewAddressText] = useState('');

  // State đổi mật khẩu
  const [pwdData, setPwdData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất tài khoản thành công.');
    } catch {
      toast.error('Có lỗi khi đăng xuất');
    }
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
    toast.success('Đã lưu địa chỉ giao hàng mới!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (!pwdData.oldPassword) {
      setPwdError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (pwdData.newPassword.length < 6) {
      setPwdError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setPwdLoading(true);
    try {
      await changePassword({
        oldPassword: pwdData.oldPassword,
        newPassword: pwdData.newPassword,
      });
      setPwdSuccess('Đổi mật khẩu thành công!');
      toast.success('Đổi mật khẩu tài khoản thành công!');
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Change password error:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Mật khẩu cũ không chính xác. Vui lòng kiểm tra lại!';
      setPwdError(typeof msg === 'string' ? msg : 'Lỗi khi đổi mật khẩu');
      toast.error('Đổi mật khẩu thất bại');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb items={[{ label: 'Hồ sơ cá nhân' }]} />

      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-xs">
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
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 shadow-xs"
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
            onSelectSection={setActiveSection}
            onToggleDemoSignOut={handleSignOut}
          />
        </div>

        <div className="space-y-6 lg:col-span-8">
          {activeSection === 'info' && (
            <ProfileForm profile={profile} onSave={updateProfileSimulated} />
          )}

          {activeSection === 'addresses' && (
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
                      Lưu địa chỉ
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

          {activeSection === 'password' && (
            <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="border-b border-zinc-100 pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-zinc-900">
                      Đổi mật khẩu tài khoản
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Cập nhật mật khẩu định kỳ để bảo vệ tài khoản và đơn hàng của bạn.
                    </p>
                  </div>
                </div>
              </div>

              {pwdError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800 border border-rose-200">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdSuccess && (
                <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <ShopInput
                  type="password"
                  label="Mật khẩu hiện tại (*)"
                  icon={Lock}
                  placeholder="Nhập mật khẩu đang sử dụng..."
                  value={pwdData.oldPassword}
                  onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                  required
                />

                <ShopInput
                  type="password"
                  label="Mật khẩu mới (tối thiểu 6 ký tự) (*)"
                  icon={Lock}
                  placeholder="Nhập mật khẩu mới..."
                  value={pwdData.newPassword}
                  onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />

                <ShopInput
                  type="password"
                  label="Xác nhận mật khẩu mới (*)"
                  icon={Lock}
                  placeholder="Nhập lại mật khẩu mới..."
                  value={pwdData.confirmPassword}
                  onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />

                <div className="pt-2">
                  <ShopButton
                    type="submit"
                    variant="primary"
                    disabled={pwdLoading}
                    className="inline-flex items-center gap-2"
                  >
                    {pwdLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Đang cập nhật...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Cập nhật mật khẩu</span>
                      </>
                    )}
                  </ShopButton>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
