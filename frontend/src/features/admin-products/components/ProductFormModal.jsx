import { useState } from 'react';
import { AlertTriangle, ImagePlus, Loader2, LogIn, Plus, Trash2, X, Flame } from 'lucide-react';
import ModalShell from './ModalShell';
import { createProduct, updateProduct, setSalePrice, removeSalePrice } from '../services/productService';
import { getApiErrorMessage, getErrorStatus } from '../utils/apiError';
import { formatNumber, getSalePrice, resolveImageUrl } from '../utils/productMapper';
import {
  buildPayload,
  emptyForm,
  filledVariants,
  formFromProduct,
  newVariantRow,
  slugify,
  validateForm,
} from '../utils/productForm';

const MAX_IMAGES = 8;
const MAX_IMAGE_MB = 5;

const inputCls = (hasError) =>
  `w-full px-2.5 py-1.5 rounded-md border bg-white focus:outline-none focus:ring-1 ${
    hasError ? 'border-rose-300 focus:ring-rose-400' : 'border-gray-200 focus:ring-emerald-500'
  }`;

function Field({ label, required, error, hint, children, className = '' }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className="font-semibold text-gray-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && !error && <span className="block text-[10px] text-gray-400">{hint}</span>}
      {error && <span className="block text-[11px] text-rose-600 font-medium">{error}</span>}
    </label>
  );
}

/**
 * Form Thêm / Sửa sản phẩm.
 * - mode "create": POST /api/products
 * - mode "edit":   PUT  /api/products/{id}
 * - Giá khuyến mãi lưu riêng qua /api/product-prices/products/{id}
 */
export default function ProductFormModal({ mode, product, brands, categories, auth, onClose, onSaved }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState(() => (isEdit ? formFromProduct(product) : emptyForm()));
  const [images, setImages] = useState([]); // [{ file, url }]
  const [errors, setErrors] = useState({});
  const [variantErrors, setVariantErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const existingImages = isEdit ? (product.images ?? []).map(resolveImageUrl).filter(Boolean) : [];
  const totalStock = filledVariants(form).reduce((s, r) => s + (Number(r.stockQuantity) || 0), 0);

  // ----- cập nhật field -----
  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({ ...prev, name: value, slug: prev.slugTouched ? prev.slug : slugify(value) }));
    setErrors((prev) => ({ ...prev, name: undefined, slug: undefined }));
  };

  const handleSlugChange = (value) => {
    setForm((prev) => ({ ...prev, slug: value, slugTouched: true }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  // ----- biến thể -----
  const addVariant = () => setForm((prev) => ({ ...prev, variants: [...prev.variants, newVariantRow()] }));
  const removeVariant = (key) =>
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((r) => r._key !== key) }));
  const updateVariant = (key, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((r) => (r._key === key ? { ...r, [field]: value } : r)),
    }));
    setVariantErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  // ----- ảnh -----
  const revokeAll = () => images.forEach((i) => URL.revokeObjectURL(i.url));

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;

    const accepted = [];
    let problem = '';
    picked.forEach((file) => {
      if (!file.type.startsWith('image/')) problem = `"${file.name}" không phải file ảnh.`;
      else if (file.size > MAX_IMAGE_MB * 1024 * 1024) problem = `"${file.name}" vượt quá ${MAX_IMAGE_MB}MB.`;
      else accepted.push({ file, url: URL.createObjectURL(file) });
    });

    setImages((prev) => {
      const room = MAX_IMAGES - prev.length;
      if (accepted.length > room) {
        problem = `Chỉ được chọn tối đa ${MAX_IMAGES} ảnh.`;
        accepted.slice(room).forEach((a) => URL.revokeObjectURL(a.url));
      }
      return [...prev, ...accepted.slice(0, Math.max(room, 0))];
    });
    setImageError(problem);
  };

  const removeImage = (url) => {
    URL.revokeObjectURL(url);
    setImages((prev) => prev.filter((i) => i.url !== url));
    setImageError('');
  };

  // ----- đóng / lưu -----
  const handleClose = () => {
    if (saving) return;
    revokeAll();
    onClose();
  };

  // Đồng bộ giá khuyến mãi (bảng product_prices) sau khi lưu sản phẩm
  const syncSalePrice = async (productId) => {
    const wanted = form.salePrice.trim() === '' ? null : Number(form.salePrice);
    if (isEdit) {
      const current = getSalePrice(product);
      if (wanted === null) {
        if (product.productPrice) await removeSalePrice(productId);
      } else if (wanted !== current) {
        await setSalePrice(productId, wanted);
      }
    } else if (wanted !== null) {
      await setSalePrice(productId, wanted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const result = validateForm(form);
    setErrors(result.errors);
    setVariantErrors(result.variantErrors);
    if (!result.valid) {
      setServerError('Vui lòng kiểm tra lại các trường được đánh dấu đỏ.');
      return;
    }
    if (!auth.canWrite) {
      setServerError('Bạn cần đăng nhập tài khoản ADMIN/STAFF để lưu vào database.');
      auth.requestLogin();
      return;
    }

    setSaving(true);
    setServerError('');
    try {
      const payload = buildPayload(form, { isEdit, raw: product });
      const files = images.map((i) => i.file);
      const saved = isEdit ? await updateProduct(product.id, payload, files) : await createProduct(payload, files);

      let warning = null;
      try {
        await syncSalePrice(saved?.id ?? product?.id);
      } catch (err) {
        warning = `chưa lưu được giá khuyến mãi (${getApiErrorMessage(err, 'lỗi không xác định')}).`;
      }

      revokeAll();
      onSaved({ mode, product: saved, warning });
    } catch (err) {
      if (getErrorStatus(err) === 401) auth.requestLogin();
      setServerError(getApiErrorMessage(err, 'Không thể lưu sản phẩm.'));
    } finally {
      setSaving(false);
    }
  };

  const formId = 'product-form';

  return (
    <ModalShell
      title={isEdit ? `Sửa sản phẩm: ${product.name}` : 'Thêm sản phẩm mới'}
      subtitle={
        isEdit
          ? 'Thay đổi được lưu trực tiếp vào database khi bấm "Lưu thay đổi".'
          : 'Sản phẩm mới được lưu trực tiếp vào database khi bấm "Thêm sản phẩm".'
      }
      size="lg"
      onClose={handleClose}
      disableClose={saving}
      closeOnBackdrop={false}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-gray-400">
            <span className="text-rose-500">*</span> Trường bắt buộc
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-700 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              form={formId}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold disabled:opacity-60"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
          </div>
        </div>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-5">
        {!auth.canWrite && (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <span className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Bạn chưa đăng nhập tài khoản ADMIN/STAFF nên chưa thể lưu vào database.
            </span>
            <button
              type="button"
              onClick={auth.requestLogin}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0"
            >
              <LogIn className="w-3 h-3" /> Đăng nhập
            </button>
          </div>
        )}

        {serverError && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        {/* 1. Thông tin cơ bản */}
        <section className="space-y-3">
          <h3 className="font-extrabold text-gray-800 uppercase tracking-wider text-[11px]">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Tên sản phẩm" required error={errors.name} className="md:col-span-2">
              <input
                autoFocus
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Áo Thun Cotton Compact Basic"
                className={inputCls(errors.name)}
              />
            </Field>

            <Field label="Slug (đường dẫn)" required error={errors.slug} hint="Tự tạo từ tên, có thể chỉnh sửa">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={inputCls(errors.slug)}
              />
            </Field>

            <Field label="Đánh giá (0 – 5)" required error={errors.rating}>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setField('rating', e.target.value)}
                className={inputCls(errors.rating)}
              />
            </Field>

            <Field label="Thương hiệu" required error={errors.brandId}>
              <select
                value={form.brandId}
                onChange={(e) => setField('brandId', e.target.value)}
                className={inputCls(errors.brandId)}
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Danh mục" required error={errors.categoryId}>
              <select
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
                className={inputCls(errors.categoryId)}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Mô tả" className="md:col-span-2">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                className={inputCls(false)}
              />
            </Field>

            <label className="md:col-span-2 inline-flex items-center gap-2 font-medium text-gray-700 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={form.hot}
                onChange={(e) => setField('hot', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Đánh dấu là sản phẩm hot (nổi bật)
            </label>
          </div>
        </section>

        {/* 2. Giá */}
        <section className="space-y-3">
          <h3 className="font-extrabold text-gray-800 uppercase tracking-wider text-[11px]">Giá bán</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Giá niêm yết (đ)" required error={errors.price}>
              <input
                type="number"
                min="0"
                step="any"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                placeholder="VD: 199000"
                className={inputCls(errors.price)}
              />
            </Field>
            <Field
              label="Giá khuyến mãi (đ)"
              error={errors.salePrice}
              hint={isEdit ? 'Để trống để gỡ khuyến mãi' : 'Không bắt buộc – phải nhỏ hơn giá niêm yết'}
            >
              <input
                type="number"
                min="0"
                step="any"
                value={form.salePrice}
                onChange={(e) => setField('salePrice', e.target.value)}
                className={inputCls(errors.salePrice)}
              />
            </Field>
          </div>
        </section>

        {/* 3. Biến thể */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-800 uppercase tracking-wider text-[11px]">
              Biến thể (Màu / Size / Tồn kho)
            </h3>
            <span className="text-[11px] text-gray-500">
              Tổng tồn kho: <strong className="text-gray-800">{formatNumber(totalStock)} chiếc</strong>
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="px-2.5 py-2">Màu sắc</th>
                  <th className="px-2.5 py-2 w-24">Size</th>
                  <th className="px-2.5 py-2 w-28">Tồn kho</th>
                  <th className="px-2.5 py-2 w-32">Giá vốn (đ)</th>
                  <th className="px-2.5 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {form.variants.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-4 text-center text-gray-400">
                      Chưa có biến thể. Sản phẩm không có biến thể sẽ coi như hết hàng.
                    </td>
                  </tr>
                )}
                {form.variants.map((r) => (
                  <tr key={r._key} className="align-top">
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={r.color}
                        onChange={(e) => updateVariant(r._key, 'color', e.target.value)}
                        placeholder="VD: Đen"
                        aria-label="Màu sắc"
                        className={inputCls(variantErrors[r._key])}
                      />
                      {variantErrors[r._key] && (
                        <div className="text-[10px] text-rose-600 font-medium mt-0.5">{variantErrors[r._key]}</div>
                      )}
                      {r.id && <div className="text-[10px] text-gray-400 mt-0.5">SKU-{r.id}</div>}
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={r.size}
                        onChange={(e) => updateVariant(r._key, 'size', e.target.value)}
                        placeholder="M"
                        aria-label="Size"
                        className={inputCls(false)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={r.stockQuantity}
                        onChange={(e) => updateVariant(r._key, 'stockQuantity', e.target.value)}
                        aria-label="Tồn kho"
                        className={inputCls(false)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={r.costPrice}
                        onChange={(e) => updateVariant(r._key, 'costPrice', e.target.value)}
                        aria-label="Giá vốn"
                        className={inputCls(false)}
                      />
                    </td>
                    <td className="px-1 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeVariant(r._key)}
                        aria-label="Xóa dòng biến thể"
                        title="Xóa dòng này"
                        className="p-1.5 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-dashed border-emerald-400 text-emerald-700 font-semibold hover:bg-emerald-50"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm biến thể
          </button>
        </section>

        {/* 4. Hình ảnh */}
        <section className="space-y-2">
          <h3 className="font-extrabold text-gray-800 uppercase tracking-wider text-[11px]">Hình ảnh</h3>

          {isEdit && existingImages.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] text-gray-500">
                Ảnh hiện tại{' '}
                {images.length > 0 && <span className="text-amber-700 font-semibold">(sẽ bị thay thế bởi ảnh mới)</span>}
              </div>
              <div className={`flex flex-wrap gap-2 ${images.length > 0 ? 'opacity-40' : ''}`}>
                {existingImages.map((src) => (
                  <img key={src} src={src} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {images.map((i, idx) => (
              <div key={i.url} className="relative">
                <img src={i.url} alt="" className="w-14 h-14 rounded-lg object-cover border border-emerald-300" />
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold text-white bg-emerald-700/90 rounded-b-lg">
                    Ảnh chính
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i.url)}
                  aria-label="Bỏ ảnh này"
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <label className="w-14 h-14 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-emerald-700 hover:border-emerald-400 flex flex-col items-center justify-center cursor-pointer">
                <ImagePlus className="w-4 h-4" />
                <span className="text-[9px] font-semibold mt-0.5">Thêm ảnh</span>
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" aria-label="Chọn ảnh sản phẩm" />
              </label>
            )}
          </div>

          <p className="text-[10px] text-gray-400">
            Tối đa {MAX_IMAGES} ảnh, mỗi ảnh ≤ {MAX_IMAGE_MB}MB. Ảnh đầu tiên là ảnh chính.
            {isEdit && ' Nếu không chọn ảnh mới, ảnh hiện tại được giữ nguyên.'}
          </p>
          {imageError && <p className="text-[11px] text-rose-600 font-medium">{imageError}</p>}
        </section>
      </form>
    </ModalShell>
  );
}
