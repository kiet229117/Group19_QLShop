import { Link } from 'react-router-dom';
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
import useSettings, { tabs } from '../hooks/useSettings';

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
          readOnly ? 'bg-gray-50' : 'bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
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
        className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
  const { settings, activeTab, update, saveSettings, resetSettings } = useSettings();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        saveSettings();
      }}
      className="mx-auto max-w-7xl space-y-5 text-xs pb-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <div className="mb-1 text-[11px] font-medium text-gray-500">Phân hệ Quản trị <span className="px-1 text-gray-300">/</span> Cấu hình Hệ thống</div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Cấu hình Hệ thống QLShop</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
            Quản lý thông tin cửa hàng quần áo, chính sách vận hành và kết nối các dịch vụ thanh toán, giao vận.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Khôi phục mặc định
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-900"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu Cấu Hình
          </button>
        </div>
      </div>

      <nav aria-label="Danh mục cấu hình" className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-2xs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            to={`/admin/settings/${id}`}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold transition ${
              activeTab === id
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {id === 'general' && activeTab === id && (
              <span className="rounded bg-white/20 px-1.5 py-0.2 text-[9px]">Chính</span>
            )}
          </Link>
        ))}
      </nav>

      {activeTab === 'general' && (
        <div className="grid items-start gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <Panel title="Thông tin Cửa hàng & Nhận diện Thương hiệu" subtitle="Quản lý nhận diện shop trên hóa đơn và kênh khách hàng." badge="Đang kinh doanh" icon={Globe2}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Tên hiển thị của Shop (Store Name) *" value={settings.storeName} onChange={update('storeName')} />
                </div>
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-2.5">
                    <span className="mb-2 block text-[11px] font-semibold text-gray-700">Logo Shop Áo</span>
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-xs font-black text-white">QL</span>
                      <div><span className="block text-[10px] font-semibold text-gray-700">Logo QLShop</span><span className="text-[9px] text-gray-400">Đã kích hoạt</span></div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-2.5">
                    <span className="mb-2 block text-[11px] font-semibold text-gray-700">Favicon & Biểu tượng Tab</span>
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><Layers3 className="h-4 w-4" /></span>
                      <div><span className="block text-[10px] font-semibold text-gray-700">Biểu tượng áo</span><span className="text-[9px] text-gray-400">PNG chuẩn</span></div>
                    </div>
                  </div>
                </div>
                <SettingSelect label="Đơn vị tiền tệ chính" value={settings.currency} onChange={update('currency')} options={['VND (Việt Nam Đồng - đ)', 'USD (US Dollar - $)', 'EUR (Euro - €)']} />
                <SettingSelect label="Tỷ giá tự động" value={settings.exchangeRate} onChange={update('exchangeRate')} options={['Cập nhật mỗi 6 giờ (Vietcombank API)', 'Cập nhật mỗi ngày', 'Tắt cập nhật tự động']} />
                <Field label="Hotline hỗ trợ CSKH" value={settings.hotline} onChange={update('hotline')} />
                <Field label="Email CSKH & Thông báo" value={settings.supportEmail} onChange={update('supportEmail')} type="email" />
                <div className="sm:col-span-2">
                  <Field label="Địa chỉ trụ sở / Kho xuất hàng" value={settings.address} onChange={update('address')} />
                </div>
              </div>
            </Panel>

            <Panel title="Cấu hình Voucher & Khuyến mãi" subtitle="Quy tắc cộng dồn Voucher và chương trình ưu đãi." badge="Marketing" icon={Layers3}>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-gray-700">Quy tắc áp dụng Voucher đồng thời</p>
                  {[
                    { value: 'standard', title: 'Chế độ linh hoạt tiêu chuẩn', text: 'Cho phép áp dụng tối đa 1 mã giảm giá tiền áo + 1 mã miễn phí vận chuyển trên 1 đơn hàng.' },
                    { value: 'strict', title: 'Chỉ áp dụng duy nhất 1 Voucher / đơn', text: 'Khách hàng chỉ được chọn 1 mã có giá trị giảm cao nhất.' }
                  ].map((option) => (
                    <label key={option.value} className={`mb-1.5 flex cursor-pointer gap-2 rounded-lg border p-2.5 ${settings.voucherStacking === option.value ? 'border-emerald-300 bg-emerald-50/60' : 'border-gray-200'}`}>
                      <input type="radio" name="voucherStacking" value={option.value} checked={settings.voucherStacking === option.value} onChange={update('voucherStacking')} className="mt-0.5 accent-emerald-800" />
                      <span><span className="block text-[10px] font-bold text-gray-800">{option.title}</span><span className="mt-0.5 block text-[9px] leading-4 text-gray-500">{option.text}</span></span>
                    </label>
                  ))}
                </div>
                <Toggle label="Chương trình Tích điểm Thành viên" description="Cho phép khách hàng tích điểm mỗi khi mua áo." checked={settings.rewardsEnabled} onChange={update('rewardsEnabled')} />
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Chính sách Mua hàng & Tồn kho" subtitle="Quy tắc đặt hàng và ngưỡng cảnh báo kho." icon={Truck}>
              <div className="space-y-3">
                <Field label="Thời gian giữ đơn chưa thanh toán (giờ)" value={settings.autoCancelHours} onChange={update('autoCancelHours')} type="number" />
                <Field label="Ngưỡng cảnh báo biến thể áo sắp hết" value={settings.lowStockLimit} onChange={update('lowStockLimit')} type="number" />
                <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[10px] leading-4 text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Đơn chưa thanh toán sẽ tự động hủy khi hết thời gian giữ đơn để hoàn lại số lượng áo vào kho.
                </div>
              </div>
            </Panel>

            <Panel title="Bảo mật Hệ thống" subtitle="Quy tắc bảo vệ tài khoản quản trị." badge="Đang bật" icon={ShieldCheck}>
              <div className="space-y-3">
                <Toggle label="Xác thực hai yếu tố (2FA bắt buộc)" description="Bắt buộc bật cho tài khoản admin & nhân viên." checked={settings.twoFactor} onChange={update('twoFactor')} />
                <SettingSelect label="Thời gian phiên đăng nhập" value={settings.loginTimeout} onChange={update('loginTimeout')} options={['1 giờ không hoạt động', '4 giờ không hoạt động', '8 giờ không hoạt động', 'Không tự động đăng xuất']} />
              </div>
            </Panel>
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Tài khoản quản trị viên" subtitle="Danh sách người có quyền truy cập hệ thống." icon={KeyRound}>
            <div className="space-y-2">
              {[
                ['Kiệt Ông chủ tương lai', 'admin@shopao.com', 'Admin Tối Cao (Chủ shop)', 'Toàn quyền hệ thống'],
                ['Nhân viên Quản lý Kho', 'staff.kho@shopao.com', 'Quản lý kho', 'Sản phẩm, nhập kho, nhà cung cấp'],
                ['Nhân viên CSKH', 'cskh@shopao.com', 'Chăm sóc khách hàng', 'Hội thoại chat, bình luận, đơn hàng']
              ].map(([name, email, role, permission]) => (
                <div key={email} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500 font-mono">{email}</p></div>
                  <div className="text-right"><p className="text-[10px] font-bold text-emerald-800">{role}</p><p className="text-[9px] text-gray-400">{permission}</p></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Bảo vệ tài khoản" subtitle="Chính sách phiên đăng nhập và mật khẩu." icon={ShieldCheck}>
            <div className="space-y-4">
              <Toggle label="Bắt buộc xác thực hai yếu tố (2FA)" description="Yêu cầu mã xác thực khi đăng nhập." checked={settings.twoFactor} onChange={update('twoFactor')} />
              <SettingSelect label="Tự động đăng xuất sau" value={settings.loginTimeout} onChange={update('loginTimeout')} options={['1 giờ không hoạt động', '4 giờ không hoạt động', '8 giờ không hoạt động']} />
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Phương thức thanh toán" subtitle="Cổng thanh toán hỗ trợ khi mua áo." icon={CreditCard}>
            <div className="space-y-2">
              {[
                ['Thanh toán khi nhận hàng (COD)', 'Khách nhận áo, kiểm tra và trả tiền', 'Đang hoạt động'],
                ['VNPAY QR', 'Quét mã chuyển khoản ngân hàng', 'Đang hoạt động'],
                ['Ví MoMo', 'Thanh toán trực tiếp qua ví MoMo', 'Đang hoạt động'],
                ['Chuyển khoản Vietcombank', 'Xác nhận hóa đơn tự động', 'Đang hoạt động']
              ].map(([name, details, status]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{details}</p></div>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">{status}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Tiền tệ hiển thị" subtitle="Thiết lập đơn vị tiền tệ trên website." icon={Globe2}>
            <div className="space-y-3">
              <SettingSelect label="Tiền tệ mặc định" value={settings.currency} onChange={update('currency')} options={['VND (Việt Nam Đồng - đ)', 'USD (US Dollar - $)', 'EUR (Euro - €)']} />
              <SettingSelect label="Nguồn cập nhật tỷ giá" value={settings.exchangeRate} onChange={update('exchangeRate')} options={['Cập nhật mỗi 6 giờ (Vietcombank API)', 'Cập nhật mỗi ngày']} />
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Đơn vị vận chuyển đối tác" subtitle="Các hãng giao áo toàn quốc." icon={Truck}>
            <div className="space-y-2">
              {[
                ['Giao Hàng Nhanh (GHN)', 'Giao 24h - 48h toàn quốc', 'Đang kết nối'],
                ['Giao Hàng Tiết Kiệm (GHTK)', 'Phủ sóng tận xã huyện', 'Đang kết nối'],
                ['Viettel Post', 'Giao hỏa tốc 4h nội thành', 'Đang kết nối']
              ].map(([name, detail, status]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{detail}</p></div>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">{status}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Quy tắc kho & giao hàng" subtitle="Cấu hình xử lý kiện hàng." icon={Layers3}>
            <div className="space-y-3">
              <Field label="Tự hủy đơn chưa thanh toán sau (giờ)" value={settings.autoCancelHours} onChange={update('autoCancelHours')} type="number" />
              <Field label="Ngưỡng cảnh báo biến thể áo sắp hết" value={settings.lowStockLimit} onChange={update('lowStockLimit')} type="number" />
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Email & Thông báo đơn hàng" subtitle="Cấu hình gửi email tự động." icon={Mail}>
            <div className="space-y-3">
              <Field label="Email thông báo hệ thống" value={settings.supportEmail} onChange={update('supportEmail')} type="email" />
              <Field label="Hotline CSKH" value={settings.hotline} onChange={update('hotline')} />
              <Toggle label="Gửi email khi khách đặt đơn áo mới" description="Thông báo ngay cho quản trị viên." checked={settings.rewardsEnabled} onChange={update('rewardsEnabled')} />
            </div>
          </Panel>
          <Panel title="Mẫu thông báo tự động" subtitle="Các tin nhắn gửi đến khách hàng." icon={Bell}>
            <div className="space-y-2">
              {[
                ['Xác nhận đặt áo thành công', 'Email + SMS', 'Đã bật'],
                ['Đơn áo đang được shipper giao', 'Email + SMS', 'Đã bật'],
                ['Thông báo mã voucher mới', 'Email marketing', 'Đã bật']
              ].map(([name, channel, status]) => (
                <div key={name} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div><p className="text-xs font-bold text-gray-800">{name}</p><p className="text-[10px] text-gray-500">{channel}</p></div>
                  <span className="text-[10px] font-bold text-emerald-800">{status}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="API & Webhook" subtitle="Cổng kết nối hệ thống QLShop." icon={Webhook}>
            <div className="space-y-3">
              <Field label="API Endpoint Server" value="http://localhost:8080/api" readOnly />
              <Field label="Webhook đơn hàng" value="http://localhost:8080/api/webhook/orders" readOnly />
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[10px] text-emerald-800">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                Hệ thống API backend đang chạy ổn định tại cổng 8080.
              </div>
            </div>
          </Panel>
          <Panel title="Dịch vụ tích hợp" subtitle="Trạng thái các module kết nối." icon={Activity}>
            <div className="space-y-2">
              {['MySQL Database (shopao_19)', 'Gmail SMTP (Gửi OTP & Đơn hàng)', 'GHN API Giao vận', 'VNPAY Sandbox'].map((service) => (
                <div key={service} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="text-xs font-semibold text-gray-800">{service}</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Hoạt động</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </form>
  );
}
