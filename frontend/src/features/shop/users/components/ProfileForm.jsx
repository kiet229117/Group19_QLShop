import { useState } from 'react';
import { Calendar, CheckCircle2, Edit3, Mail, MapPin, Phone, Sparkles, User } from 'lucide-react';
import ShopInput from '../../../../components/shop/common/ShopInput';
import ShopButton from '../../../../components/shop/common/ShopButton';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

function validateProfile(values) {
  const errors = {};
  if (!values.fullname.trim()) {
    errors.fullname = 'Họ và tên không được để trống.';
  }
  if (!values.email.trim()) {
    errors.email = 'Email không được để trống.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Địa chỉ email không đúng định dạng.';
  }
  const cleanPhone = values.phone.replace(/\s+/g, '');
  if (!cleanPhone) {
    errors.phone = 'Số điện thoại không được để trống.';
  } else if (!/^0\d{8,10}$/.test(cleanPhone)) {
    errors.phone = 'Số điện thoại cần bắt đầu bằng 0 và gồm 9–11 chữ số.';
  }
  if (!values.defaultAddress.trim()) {
    errors.defaultAddress = 'Vui lòng nhập địa chỉ mặc định.';
  }
  return errors;
}

/**
 * Hiển thị và chỉnh sửa thông tin cá nhân bằng state cục bộ (không gọi API).
 */
export default function ProfileForm({ profile, onSave }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({
    fullname: profile?.fullname || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    birthday: profile?.birthday || '2003-08-15',
    gender: profile?.gender || 'MALE',
    defaultAddress: profile?.defaultAddress || '',
  });
  const [errors, setErrors] = useState({});
  const [savedNotice, setSavedNotice] = useState('');

  const handleStartEdit = () => {
    setValues({
      fullname: profile?.fullname || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      birthday: profile?.birthday || '2003-08-15',
      gender: profile?.gender || 'MALE',
      defaultAddress: profile?.defaultAddress || '',
    });
    setErrors({});
    setSavedNotice('');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
  };

  const handleChange = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProfile(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave?.(values);
    setEditing(false);
    setSavedNotice(
      'Đã lưu thông tin hồ sơ (trạng thái mô phỏng trên giao diện, không gửi lên Backend).'
    );
  };

  const genderLabel =
    GENDER_OPTIONS.find((g) => g.value === profile?.gender)?.label || 'Nam';

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-xl font-black tracking-tight text-zinc-900">
            Thông tin cá nhân
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Quản lý thông tin liên hệ và địa chỉ nhận hàng mặc định của bạn trên giao diện.
          </p>
        </div>

        {!editing && (
          <ShopButton variant="outline" size="sm" onClick={handleStartEdit}>
            <Edit3 className="h-4 w-4" aria-hidden="true" />
            Chỉnh sửa hồ sơ
          </ShopButton>
        )}
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{savedNotice}</span>
        </div>
      )}

      {!editing ? (
        /* Chế độ xem thông tin */
        <dl className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Họ và tên
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">{profile?.fullname}</dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Tên tài khoản
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">@{profile?.username}</dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Địa chỉ Email
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">{profile?.email}</dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Số điện thoại
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">{profile?.phone}</dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Ngày sinh
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">{profile?.birthday}</dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Giới tính
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">{genderLabel}</dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Địa chỉ giao hàng mặc định
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">
              {profile?.defaultAddress}
            </dd>
          </div>
        </dl>
      ) : (
        /* Form chỉnh sửa thông tin */
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ShopInput
              label="Họ và tên (*)"
              icon={User}
              value={values.fullname}
              error={errors.fullname}
              onChange={(e) => handleChange('fullname', e.target.value)}
            />

            <ShopInput
              label="Số điện thoại (*)"
              icon={Phone}
              value={values.phone}
              error={errors.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ShopInput
              label="Địa chỉ Email (*)"
              icon={Mail}
              type="email"
              value={values.email}
              error={errors.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />

            <ShopInput
              label="Ngày sinh"
              icon={Calendar}
              type="date"
              value={values.birthday}
              onChange={(e) => handleChange('birthday', e.target.value)}
            />
          </div>

          <div>
            <p className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Giới tính
            </p>
            <div className="flex flex-wrap gap-2.5">
              {GENDER_OPTIONS.map((opt) => {
                const selected = values.gender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('gender', opt.value)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ShopInput
            label="Địa chỉ nhận hàng mặc định (*)"
            icon={MapPin}
            value={values.defaultAddress}
            error={errors.defaultAddress}
            onChange={(e) => handleChange('defaultAddress', e.target.value)}
          />

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-4">
            <ShopButton type="button" variant="outline" onClick={handleCancel}>
              Hủy chỉnh sửa
            </ShopButton>
            <ShopButton type="submit" variant="primary">
              Lưu thay đổi (Mô phỏng)
            </ShopButton>
          </div>
        </form>
      )}

      <p className="flex items-center gap-1.5 text-[11px] text-zinc-400">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Mọi thay đổi được lưu trong state React cục bộ để minh họa giao diện.
      </p>
    </div>
  );
}
