// Helper cho form Thêm / Sửa sản phẩm: khởi tạo, kiểm tra hợp lệ, dựng payload gửi backend.
import { getSalePrice } from './productMapper';

// Bỏ dấu tiếng Việt -> slug (vd: "Áo Thun Basic" -> "ao-thun-basic")
export function slugify(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let rowSeq = 0;
export function newVariantRow(v = {}) {
  rowSeq += 1;
  return {
    _key: `variant-${rowSeq}`,
    id: v.id ?? null,
    color: v.color ?? '',
    size: v.size ?? '',
    stockQuantity: String(v.stockQuantity ?? 0),
    costPrice: v.costPrice === null || v.costPrice === undefined ? '' : String(v.costPrice),
  };
}

export function emptyForm() {
  return {
    name: '',
    slug: '',
    slugTouched: false,
    price: '',
    salePrice: '',
    description: '',
    rating: '0',
    brandId: '',
    categoryId: '',
    hot: false,
    variants: [newVariantRow()],
  };
}

// raw = object sản phẩm gốc backend trả về
export function formFromProduct(raw) {
  const sale = getSalePrice(raw);
  return {
    name: raw.name ?? '',
    slug: raw.slug ?? '',
    slugTouched: true,
    price: String(raw.price ?? ''),
    salePrice: sale ? String(sale) : '',
    description: raw.description ?? '',
    rating: String(raw.rating ?? 0),
    brandId: raw.brandId ? String(raw.brandId) : '',
    categoryId: raw.categoryId ? String(raw.categoryId) : '',
    hot: Boolean(raw.hot ?? raw.isHot),
    variants: (raw.variants ?? []).map((v) => newVariantRow(v)),
  };
}

const isBlankRow = (r) =>
  !r.color.trim() && !r.size.trim() && (r.stockQuantity === '' || Number(r.stockQuantity) === 0) && r.costPrice === '';

// Các dòng biến thể thực sự có dữ liệu (bỏ qua dòng trống)
export const filledVariants = (form) => form.variants.filter((r) => !isBlankRow(r));

const isNum = (v) => v !== '' && v !== null && !Number.isNaN(Number(v));

export function validateForm(form) {
  const errors = {};
  const variantErrors = {};

  const name = form.name.trim();
  if (name.length < 3 || name.length > 255) errors.name = 'Tên sản phẩm phải từ 3 đến 255 ký tự';

  const slug = form.slug.trim();
  if (slug.length < 3 || slug.length > 255) errors.slug = 'Slug phải từ 3 đến 255 ký tự';
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.slug = 'Slug chỉ gồm chữ thường, số và dấu gạch ngang';

  if (!isNum(form.price) || Number(form.price) <= 0) errors.price = 'Giá bán phải lớn hơn 0';

  if (form.salePrice.trim() !== '') {
    if (!isNum(form.salePrice) || Number(form.salePrice) <= 0) errors.salePrice = 'Giá khuyến mãi phải lớn hơn 0';
    else if (isNum(form.price) && Number(form.salePrice) >= Number(form.price)) {
      errors.salePrice = 'Giá khuyến mãi phải nhỏ hơn giá bán gốc';
    }
  }

  if (!isNum(form.rating) || Number(form.rating) < 0 || Number(form.rating) > 5) {
    errors.rating = 'Đánh giá phải từ 0 đến 5';
  }

  if (!form.brandId) errors.brandId = 'Vui lòng chọn thương hiệu';
  if (!form.categoryId) errors.categoryId = 'Vui lòng chọn danh mục';

  const seen = new Set();
  filledVariants(form).forEach((r) => {
    const color = r.color.trim();
    const size = r.size.trim();
    if (!color) variantErrors[r._key] = 'Thiếu màu sắc';
    else if (!size) variantErrors[r._key] = 'Thiếu size';
    else if (!isNum(r.stockQuantity) || !Number.isInteger(Number(r.stockQuantity)) || Number(r.stockQuantity) < 0) {
      variantErrors[r._key] = 'Tồn kho phải là số nguyên ≥ 0';
    } else if (r.costPrice !== '' && (!isNum(r.costPrice) || Number(r.costPrice) < 0)) {
      variantErrors[r._key] = 'Giá vốn không hợp lệ';
    } else {
      const k = `${color.toLowerCase()}|${size.toUpperCase()}`;
      if (seen.has(k)) variantErrors[r._key] = 'Trùng màu + size với dòng khác';
      seen.add(k);
    }
  });

  return { errors, variantErrors, valid: Object.keys(errors).length === 0 && Object.keys(variantErrors).length === 0 };
}

function normalizedRows(form) {
  return filledVariants(form).map((r) => ({
    id: r.id ?? null,
    color: r.color.trim(),
    size: r.size.trim().toUpperCase(),
    stockQuantity: Number(r.stockQuantity || 0),
    costPrice: r.costPrice === '' ? null : Number(r.costPrice),
  }));
}

// So sánh biến thể trong form với biến thể gốc để biết người dùng có chỉnh sửa không
export function variantsChanged(form, raw) {
  const original = (raw?.variants ?? []).map((v) => ({
    id: v.id ?? null,
    color: (v.color ?? '').trim(),
    size: (v.size ?? '').trim().toUpperCase(),
    stockQuantity: Number(v.stockQuantity ?? 0),
    costPrice: v.costPrice ?? null,
  }));
  return JSON.stringify(normalizedRows(form)) !== JSON.stringify(original);
}

/**
 * Dựng body gửi backend (ProductRequest).
 * - Backend map field boolean `isHot` thành `hot`.
 * - Khi sửa mà không đụng tới biến thể thì không gửi `variants` để backend giữ nguyên.
 */
export function buildPayload(form, { isEdit = false, raw = null } = {}) {
  const payload = {
    name: form.name.trim(),
    price: Number(form.price),
    description: form.description.trim(),
    rating: Number(form.rating),
    slug: form.slug.trim(),
    brandId: Number(form.brandId),
    categoryId: Number(form.categoryId),
    hot: Boolean(form.hot),
  };

  if (!isEdit || variantsChanged(form, raw)) {
    payload.variants = normalizedRows(form).map(({ id, ...rest }) => (id ? { id, ...rest } : rest));
  }
  return payload;
}
