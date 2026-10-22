import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Bell,
  Check,
  CreditCard,
  Globe2,
  KeyRound,
  Layers3,
  Mail,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Truck,
  Webhook
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'Cấu hình Chung (General)', icon: Settings2 },
  { id: 'access', label: 'Phân quyền & Tài khoản', icon: KeyRound },
  { id: 'payments', label: 'Thanh toán & Tiền tệ', icon: CreditCard },
  { id: 'shipping', label: 'Vận chuyển & Kho hàng', icon: Truck },
  { id: 'notifications', label: 'Email & Thông báo', icon: Bell },
  { id: 'integrations', label: 'API & Tích hợp', icon: Webhook }
];

const initialSettings = {
  storeName: 'NovaCommerce Flagship Store',
  currency: 'VND (Việt Nam Đồng - đ)',
  exchangeRate: 'Cập nhật mỗi 6 giờ (Vietcombank API)',
  hotline: '1900 6868 (8:00 - 22:00)',
  supportEmail: 'support@novacommerce.vn',
  address: 'Tầng 18, Tòa nhà Apex Financial Center, 128 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
  autoCancelHours: '24',
  lowStockLimit: '10',
  voucherStacking: 'standard',
  rewardsEnabled: true,
  rewardRate: '10,000',
  rewardValue: '1',
  loginTimeout: '4 giờ không hoạt động',
  twoFactor: true
};

function Panel({ title, subtitle, badge, icon: Icon, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[11px] text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <span className="shrink-0 rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, hint, type = 'text', readOnly = false }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[11px] font-semibold text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full rounded-md border border-gray-200 px-2.5 py-2 text-xs text-gray-800 outline-none transition ${
          readOnly ? 'bg-gray-50' : 'bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
        }`}
      />
      {hint && <span className="mt-1 block text-[10px] text-gray-400">{hint}</span>}
    </label>
  );
}

function SettingSelect({ label, value, onChange, options }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[11px] font-semibold text-gray-700">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span>
        <span className="block text-xs font-semibold text-gray-800">{label}</span>
        {description && <span className="mt-0.5 block text-[10px] text-gray-500">{description}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-emerald-600"
      />
    </label>
  );
}

export default function SettingsPage() {
  const location = useLocation();
  const [settings, setSettings] = useState(initialSettings);
  const [notice, setNotice] = useState('');
  const currentTab = location.pathname.split('/').filter(Boolean).at(-1);
  const activeTab = tabs.some((tab) => tab.id === currentTab) ? currentTab : 'general';

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((current) => ({ ...current, [key]: value }));
    setNotice('');
  };

  const saveMockSettings = () => {
    setNotice('Đã lưu cấu hình mẫu trên giao diện. Dữ liệu chưa được gửi lên máy chủ.');
  };

  const resetMockSettings = () => {
    setSettings(initialSettings);
    setNotice('Đã khôi phục dữ liệu cấu hình mẫu ban đầu.');
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        saveMockSettings();
      }}
      className="mx-auto max-w-7xl space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-[11px] font-medium text-gray-500">Phân hệ Quản trị <span className="px-1 text-gray-300">/</span> Cấu hình Hệ thống</div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Cấu hình Hệ thống</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            Quản lý thông tin cửa hàng, chính sách vận hành và các kết nối hệ thống.
            Đây là giao diện minh họa sử dụng dữ liệu mẫu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetMockSettings}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Khôi phục mặc định
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu cấu hình
          </button>
        </div>
      </div>

      <nav aria-label="Danh mục cấu hình" className="flex gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            to={`/admin/settings/${id}`}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-[11px] font-semibold transition ${
              activeTab === id
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {id === 'general' && activeTab === id && (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] text-emerald-700">Primary</span>
            )}
          </Link>
        ))}
      </nav>

      {notice && (
        <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
          <Check className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      {activeTab === 'general' && (
        <div className="grid items-start gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <Panel title="Thông tin Gian hàng & Nhận diện Thương hiệu" subtitle="Quản lý nhận diện cửa hàng trên hóa đơn và kênh khách hàng." badge="Đang kinh doanh" icon={Globe2}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Tên hiển thị của Shop (Store Display Name) *" value={settings.storeName} onChange={update('storeName')} />
                </div>
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-gray-200 p-2.5">
                    <span className="mb-2 block text-[11px] font-semibold text-gray-700">Logo Gian hàng (Primary SVG/PNG)</span>
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded bg-gray-900 text-xs font-black text-emerald-300">NC</span>
                      <div><span className="block text-[10px] font-semibold text-gray-700">Tải ảnh mới</span><span className="text-[9px] text-gray-400">PNG, SVG tối đa 2MB</span></div>
                    </div>
                  </div>
                  <div className="rounded-md border border-gray-200 p-2.5">
                    <span className="mb-2 block text-[11px] font-semibold text-gray-700">Favicon & Biểu tượng Tab</span>
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded bg-emerald-50 text-emerald-700"><Layers3 className="h-4 w-4" /></span>
                      <div><span className="block text-[10px] font-semibold text-gray-700">Thay thế</span><span className="text-[9px] text-gray-400">PNG, SVG tối đa 512KB</span></div>
                    </div>
                  </div>
                </div>
                <SettingSelect label="Đơn vị tiền tệ chính (Base Currency)" value={settings.currency} onChange={update('currency')} options={['VND (Việt Nam Đồng - đ)', 'USD (US Dollar - $)', 'EUR (Euro - €)']} />
                <SettingSelect label="Tỷ giá tự động (Forex Rate Sync)" value={settings.exchangeRate} onChange={update('exchangeRate')} options={['Cập nhật mỗi 6 giờ (Vietcombank API)', 'Cập nhật mỗi ngày', 'Tắt cập nhật tự động']} />
                <Field label="Hotline hỗ trợ CSKH" value={settings.hotline} onChange={update('hotline')} />
                <Field label="Email CSKH & Thông báo" value={settings.supportEmail} onChange={update('supportEmail')} type="email" />
                <div className="sm:col-span-2">
                  <Field label="Địa chỉ trụ sở chính / Xuất hóa đơn VAT" value={settings.address} onChange={update('address')} />
                </div>
              </div>
            </Panel>

            <Panel title="Cấu hình Voucher & Khuyến mãi Hệ thống" subtitle="Quy tắc cộng dồn Voucher (Stacking Rules) và chương trình khách hàng thân thiết." badge="Marketing v2" icon={Layers3}>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-gray-700">Quy tắc áp dụng Voucher đồng thời (Voucher Stacking)</p>
                  {[
                    { value: 'standard', title: 'Chế độ linh hoạt tiêu chuẩn (Standard E-commerce)', text: 'Cho phép áp dụng tối đa 1 mã giảm giá tiền hàng + 1 mã miễn phí vận chuyển trên 1 đơn hàng.' },
                    { value: 'strict', title: 'Chỉ áp dụng duy nhất 1 Voucher / đơn', text: 'Khách hàng chỉ được chọn 1 mã có giá trị cao nhất (không gồm mã freeship).' }
                  ].map((option) => (
                    <label key={option.value} className={`mb-1.5 flex cursor-pointer gap-2 rounded-md border p-2.5 ${settings.voucherStacking === option.value ? 'border-emerald-200 bg-emerald-50/60' : 'border-gray-200'}`}>
                      <input type="radio" name="voucherStacking" value={option.value} checked={settings.voucherStacking === option.value} onChange={update('voucherStacking')} className="mt-0.5 accent-emerald-700" />
                      <span><span className="block text-[10px] font-bold text-gray-800">{option.title}</span><span className="mt-0.5 block text-[9px] leading-4 text-gray-500">{option.text}</span></span>
                    </label>
                  ))}
                </div>
                <Toggle label="Chương trình Tích điểm Thành viên (NovaRewards)" description="Cho phép khách hàng tích và sử dụng điểm thưởng." checked={settings.rewardsEnabled} onChange={update('rewardsEnabled')} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Tỷ lệ quy đổi điểm thưởng" value={settings.rewardRate} onChange={update('rewardRate')} />
                  <Field label="Giá trị sử dụng thanh toán (điểm = đ)" value={settings.rewardValue} onChange={update('rewardValue')} />
                </div>
                <p className="text-[10px] text-gray-400">Điểm thưởng có hạn sử dụng 365 ngày kể từ ngày tích lũy đơn hàng gần nhất.</p>
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Chính sách Mua hàng & Tồn kho" subtitle="Quy tắc đặt hàng và ngưỡng cảnh báo kho." icon={Truck}>
              <div className="space-y-3">
                <Field label="Thời gian giữ đơn chưa thanh toán (giờ)" value={settings.autoCancelHours} onChange={update('autoCancelHours')} type="number" />
                <Field label="Số lượng đặt mua tối đa / biến thể" value={settings.lowStockLimit} onChange={update('lowStockLimit')} type="number" />
                <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-[10px] leading-4 text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Đơn chưa thanh toán sẽ tự động hủy khi hết thời gian giữ đơn. Đây chỉ là cấu hình minh họa.
                </div>
              </div>
            </Panel>

            <Panel title="Bảo mật Hệ thống & Nhật ký Hoạt động" subtitle="Quy tắc bảo vệ tài khoản quản trị." badge="Đang bật" icon={ShieldCheck}>
              <div className="space-y-3">
                <Toggle label="Xác thực hai yếu tố (2FA bắt buộc)" description="Bắt buộc bật cho tài khoản quản trị viên." checked={settings.twoFactor} onChange={update('twoFactor')} />
                <SettingSelect label="Thời gian phiên đăng nhập" value={settings.loginTimeout} onChange={update('loginTimeout')} options={['1 giờ không hoạt động', '4 giờ không hoạt động', '8 giờ không hoạt động', 'Không tự động đăng xuất']} />
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-gray-700"><Activity className="h-3.5 w-3.5 text-emerald-600" /> Đồng bộ Database & Cache Redis Cluster</div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded border border-gray-100 bg-white p-2"><span className="block text-[9px] text-gray-400">Redis Latency</span><span className="mt-1 block text-xs font-bold text-gray-800">1.2 ms</span></div>
                    <div className="rounded border border-gray-100 bg-white p-2"><span className="block text-[9px] text-gray-400">Cache Hit Rate</span><span className="mt-1 block text-xs font-bold text-emerald-700">98.4%</span></div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <Panel title="Tổng quan Tích hợp Đơn vị Vận chuyển & Cổng Thanh toán" subtitle="Trạng thái kết nối mẫu của các dịch vụ bên thứ ba." icon={Activity} className="xl:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'VNPAY QR / Gateway', code: 'Merchant: NOVA_001', mark: 'VN' },
                { name: 'Ví MoMo AutoPay', code: 'MID: 8888 - Live', mark: 'MM' },
                { name: 'Giao Hàng Nhanh', code: 'API: **** 9A2F', mark: 'GHN' },
                { name: 'Email SMTP', code: 'smtp.novacommerce.vn', mark: 'EM' }
              ].map((service) => (
                <div key={service.name} className="flex items-center gap-2.5 rounded-lg border border-gray-200 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-[9px] font-black text-emerald-700">{service.mark}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-bold text-gray-800">{service.name}</p><p className="truncate text-[9px] text-gray-500">{service.code}</p></div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Đang kết nối" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Tài khoản quản trị" subtitle="Dữ liệu tài khoản và vai trò minh họa." icon={KeyRound}>
            <div className="space-y-2">
              {[
                ['Nguyễn Tuấn Kiệt', 'admin@novacommerce.vn', 'Quản trị viên', 'Toàn quyền'],
                ['Trần Phương Mai', 'mai@novacommerce.vn', 'Quản lý vận hành', 'Sản phẩm, đơn hàng'],
                ['Hoàng Gia Bảo', 'bao@novacommerce.vn', 'Chăm sóc khách hàng', 'Khách hàng, hội thoại']
              ].map(([name, email, role, permission]) => (
                <div key={email} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{email}</p></div>
                  <div className="text-right"><p className="text-[10px] font-semibold text-emerald-700">{role}</p><p className="text-[9px] text-gray-400">{permission}</p></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Bảo vệ tài khoản" subtitle="Cấu hình chính sách đăng nhập mẫu." icon={ShieldCheck}>
            <div className="space-y-4">
              <Toggle label="Bắt buộc xác thực hai yếu tố (2FA)" description="Yêu cầu mã xác thực khi đăng nhập từ thiết bị mới." checked={settings.twoFactor} onChange={update('twoFactor')} />
              <SettingSelect label="Tự động đăng xuất sau" value={settings.loginTimeout} onChange={update('loginTimeout')} options={['1 giờ không hoạt động', '4 giờ không hoạt động', '8 giờ không hoạt động', 'Không tự động đăng xuất']} />
              <div className="rounded-md bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800">Nhật ký đăng nhập gần đây và thiết bị xác thực là dữ liệu minh họa.</div>
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Phương thức thanh toán" subtitle="Trạng thái kết nối cổng thanh toán (mock)." icon={CreditCard}>
            <div className="space-y-2">
              {[
                ['VNPAY QR', 'Thanh toán QR nội địa', 'Đang hoạt động'],
                ['Ví MoMo', 'Ví điện tử MoMo', 'Đang hoạt động'],
                ['Thanh toán khi nhận hàng (COD)', 'Đối soát khi giao thành công', 'Đang hoạt động'],
                ['Chuyển khoản ngân hàng', 'Xác nhận thủ công', 'Tạm ngưng']
              ].map(([name, details, status]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-md border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{details}</p></div>
                  <span className={`rounded px-2 py-1 text-[9px] font-semibold ${status === 'Đang hoạt động' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{status}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Tiền tệ & tỷ giá" subtitle="Thiết lập tiền tệ hiển thị và tỷ giá quy đổi." icon={Globe2}>
            <div className="space-y-3">
              <SettingSelect label="Tiền tệ mặc định" value={settings.currency} onChange={update('currency')} options={['VND (Việt Nam Đồng - đ)', 'USD (US Dollar - $)', 'EUR (Euro - €)']} />
              <SettingSelect label="Nguồn cập nhật tỷ giá" value={settings.exchangeRate} onChange={update('exchangeRate')} options={['Cập nhật mỗi 6 giờ (Vietcombank API)', 'Cập nhật mỗi ngày', 'Tắt cập nhật tự động']} />
              <p className="text-[10px] text-gray-400">Tỷ giá lần cập nhật gần nhất: 09:00 hôm nay (dữ liệu mẫu).</p>
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Đơn vị vận chuyển" subtitle="Nhà cung cấp đang kết nối trong dữ liệu mẫu." icon={Truck}>
            <div className="space-y-2">
              {[
                ['Giao Hàng Nhanh (GHN)', 'Kết nối API', 'Đang hoạt động'],
                ['Giao Hàng Tiết Kiệm (GHTK)', 'Kết nối API', 'Đang hoạt động'],
                ['J&T Express', 'Chưa cấu hình', 'Chưa kết nối']
              ].map(([name, detail, status]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-md border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{detail}</p></div>
                  <span className={`rounded px-2 py-1 text-[9px] font-semibold ${status === 'Đang hoạt động' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{status}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Quy tắc kho & giao hàng" subtitle="Ngưỡng kiểm soát đơn hàng mẫu." icon={Layers3}>
            <div className="space-y-3">
              <Field label="Tự hủy đơn chưa thanh toán sau (giờ)" value={settings.autoCancelHours} onChange={update('autoCancelHours')} type="number" />
              <Field label="Ngưỡng cảnh báo sắp hết hàng" value={settings.lowStockLimit} onChange={update('lowStockLimit')} type="number" />
              <div className="rounded-md bg-amber-50 p-3 text-[10px] leading-4 text-amber-800">Các thay đổi chỉ tồn tại trên giao diện và sẽ mất khi tải lại trang.</div>
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Email CSKH & Thông báo" subtitle="Cấu hình địa chỉ nhận thông báo hệ thống." icon={Mail}>
            <div className="space-y-3">
              <Field label="Email hỗ trợ khách hàng" value={settings.supportEmail} onChange={update('supportEmail')} type="email" />
              <Field label="Hotline hỗ trợ" value={settings.hotline} onChange={update('hotline')} />
              <Toggle label="Gửi email khi có đơn hàng mới" description="Thông báo tới nhóm vận hành." checked={settings.rewardsEnabled} onChange={update('rewardsEnabled')} />
              <Toggle label="Gửi cảnh báo tồn kho thấp" description="Thông báo khi số lượng sản phẩm chạm ngưỡng." checked={settings.twoFactor} onChange={update('twoFactor')} />
            </div>
          </Panel>
          <Panel title="Mẫu thông báo" subtitle="Các nội dung gửi khách hàng là dữ liệu minh họa." icon={Bell}>
            <div className="space-y-2">
              {[
                ['Xác nhận đơn hàng', 'Email + SMS', 'Đã bật'],
                ['Đơn hàng đang giao', 'Email', 'Đã bật'],
                ['Yêu cầu đổi trả', 'Email + thông báo Admin', 'Đã bật']
              ].map(([name, channel, status]) => (
                <div key={name} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{channel}</p></div>
                  <span className="text-[10px] font-semibold text-emerald-700">{status}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="API & Webhook" subtitle="Thông tin kết nối minh họa, không chứa khóa API thật." icon={Webhook}>
            <div className="space-y-3">
              <Field label="API endpoint" value="https://api.novacommerce.vn/v1" readOnly />
              <Field label="Webhook URL" value="https://novacommerce.vn/webhooks/orders" readOnly />
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-[10px] text-emerald-800">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Khóa bí mật và thông tin xác thực thật không được lưu trong giao diện mockup.
              </div>
            </div>
          </Panel>
          <Panel title="Dịch vụ bên thứ ba" subtitle="Trạng thái mẫu các tích hợp đang sử dụng." icon={Activity}>
            <div className="space-y-2">
              {['VNPAY Gateway', 'MoMo AutoPay', 'GHN Shipping API', 'SMTP Mail Service'].map((service) => (
                <div key={service} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                  <span className="text-xs font-semibold text-gray-800">{service}</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Đang kết nối</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-400">
        <span>Giao diện cấu hình mẫu · Không kết nối API</span>
        <span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-emerald-600" /> Lưu gần nhất: dữ liệu demo</span>
      </div>
    </form>
  );
}
