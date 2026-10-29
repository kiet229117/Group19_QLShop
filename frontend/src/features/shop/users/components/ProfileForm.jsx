import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Camera,
  CheckCircle2,
  Edit3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from 'lucide-react';
import ShopInput from '../../../../components/shop/common/ShopInput';
import AddressAutocompleteInput from '../../../../components/shop/common/AddressAutocompleteInput';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { useShopState } from '../../shared/context/ShopStateContext';
import shopUserService from '../services/shopUserService';
import { toast } from '../../../../components/common/Toast';
import { validateShippingAddress } from '../../shared/utils/addressUtils';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

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
  if (values.defaultAddress !== undefined) {
    errors.defaultAddress = validateShippingAddress(values.defaultAddress) || undefined;
    if (!errors.defaultAddress) delete errors.defaultAddress;
  }
  return errors;
}

/**
 * Hiển thị, tải ảnh đại diện (Avatar qua API /api/upload & /api/users/{id}/avatar)
 * và chỉnh sửa thông tin cá nhân kết nối API Backend.
 */
export default function ProfileForm({ profile, onSave, onUploadAvatar }) {
  const { uploadProfileAvatar } = useShopState();
  const uploadHandler = onUploadAvatar || uploadProfileAvatar;

  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [values, setValues] = useState({
    fullname: profile?.fullname || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    birthday: profile?.birthday || '2000-01-01',
    gender: profile?.gender || 'MALE',
    defaultAddress: profile?.defaultAddress || '',
    avatar: profile?.avatar || '',
  });
  const [errors, setErrors] = useState({});
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    setValues({
      fullname: profile?.fullname || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      birthday: profile?.birthday || '2000-01-01',
      gender: profile?.gender || 'MALE',
      defaultAddress: profile?.defaultAddress || '',
      avatar: profile?.avatar || '',
    });
  }, [profile]);

  const displayAvatarUrl =
    avatarPreview || resolveShopImageUrl(values.avatar || profile?.avatar);

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Dung lượng ảnh tối đa là 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);

    try {
      let uploadedPath = '';
      if (uploadHandler) {
        uploadedPath = await uploadHandler(file);
      } else {
        // Gọi trực tiếp API POST /api/upload?folder=avatars
        const res = await shopUserService.uploadImage(file, 'avatars');
        uploadedPath = res?.url || res;
      }

      if (uploadedPath) {
        setValues((prev) => ({ ...prev, avatar: uploadedPath }));
        setAvatarPreview('');
        setSavedNotice('Đã tải lên và cập nhật ảnh đại diện thành công!');
      }
    } catch {
      // Giữ lại preview cục bộ nếu lỗi mạng hoặc chưa kết nối
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleStartEdit = () => {
    setValues({
      fullname: profile?.fullname || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      birthday: profile?.birthday || '2000-01-01',
      gender: profile?.gender || 'MALE',
      defaultAddress: profile?.defaultAddress || '',
      avatar: profile?.avatar || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfile(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave?.(values);
      setEditing(false);
      setSavedNotice('Đã lưu thông tin hồ sơ cá nhân thành công!');
    } catch {
      // Lỗi đã được xử lý thông báo ở tầng context
    } finally {
      setSaving(false);
    }
  };

  const genderLabel =
    GENDER_OPTIONS.find((g) => g.value === (profile?.gender || '').toUpperCase())?.label ||
    profile?.gender ||
    'Chưa cập nhật';

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      {/* Input file ẩn dùng chung cho nút đổi ảnh đại diện */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-xl font-black tracking-tight text-zinc-900">
            Thông tin cá nhân
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Quản lý ảnh đại diện, thông tin liên hệ và địa chỉ nhận hàng mặc định của bạn.
          </p>
        </div>

        {!editing && (
          <ShopButton variant="outline" size="sm" onClick={handleStartEdit}>
            <Edit3 className="h-4 w-4" aria-hidden="true" />
            Chỉnh sửa hồ sơ
          </ShopButton>
        )}
      </div>

      {/* Khu vực Ảnh đại diện (Avatar Upload) */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <div className="h-full w-full overflow-hidden rounded-2xl bg-white ring-2 ring-emerald-500/20 shadow-xs">
              {displayAvatarUrl ? (
                <img
                  src={displayAvatarUrl}
                  alt={profile?.fullname || 'Ảnh đại diện'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400">
                  <User className="h-9 w-9" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleTriggerFileSelect}
              disabled={uploadingAvatar}
              title="Đổi ảnh đại diện"
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-md transition hover:bg-emerald-600 disabled:opacity-60"
            >
              {uploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">Ảnh đại diện tài khoản</h3>
            <p className="text-xs text-zinc-500">
              Hỗ trợ định dạng JPG, PNG, WEBP hoặc GIF (Tối đa 5MB).
            </p>
          </div>
        </div>

        <div>
          <ShopButton
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadingAvatar}
            onClick={handleTriggerFileSelect}
          >
            {uploadingAvatar ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Đang tải ảnh...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Tải ảnh mới
              </>
            )}
          </ShopButton>
        </div>
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
            <dd className="mt-1 text-sm font-bold text-zinc-900">
              {profile?.fullname || 'Chưa cập nhật'}
            </dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Tên tài khoản
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">
              {profile?.username ? `@${profile.username}` : 'Chưa cập nhật'}
            </dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Địa chỉ Email
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">
              {profile?.email || 'Chưa cập nhật'}
            </dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Số điện thoại
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">
              {profile?.phone || 'Chưa cập nhật'}
            </dd>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Ngày sinh
            </dt>
            <dd className="mt-1 text-sm font-bold text-zinc-900">
              {profile?.birthday || 'Chưa cập nhật'}
            </dd>
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
              {profile?.defaultAddress || 'Chưa cập nhật'}
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

          <AddressAutocompleteInput
            name="defaultAddress"
            label="Địa chỉ nhận hàng mặc định (*)"
            placeholder="Nhập số nhà, tên đường hoặc tìm kiếm tự động (VD: 268 Lý Thường Kiệt...)"
            icon={MapPin}
            value={values.defaultAddress}
            error={errors.defaultAddress}
            onChange={(e) => handleChange('defaultAddress', e.target.value)}
          />

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-4">
            <ShopButton type="button" variant="outline" onClick={handleCancel} disabled={saving}>
              Hủy chỉnh sửa
            </ShopButton>
            <ShopButton type="submit" variant="primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </ShopButton>
          </div>
        </form>
      )}
    </div>
  );
}
