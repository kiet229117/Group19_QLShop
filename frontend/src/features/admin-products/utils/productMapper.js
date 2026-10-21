import { API_ORIGIN } from '../../../services/api';

// Ngưỡng cảnh báo tồn kho – chỉnh tại đây nếu cần
export const LOW_STOCK_VARIANT = 10; // biến thể (size/màu) còn <= số này => cảnh báo
export const LOW_STOCK_PRODUCT = 20; // tổng tồn của sản phẩm <= số này => "Sắp hết hàng"

// ---------------------------------------------------------------------------
// Định dạng
// ---------------------------------------------------------------------------
const nf = new Intl.NumberFormat('vi-VN');

export const formatVND = (n) =>
  n === null || n === undefined || Number.isNaN(Number(n)) ? '—' : `${nf.format(Math.round(Number(n)))}đ`;

export const formatNumber = (n) => nf.format(n ?? 0);

// Ảnh: URL tuyệt đối (Unsplash/CDN) giữ nguyên, đường dẫn "/uploads/..." ghép origin backend
export function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

// ---------------------------------------------------------------------------
// Màu sắc: backend lưu tên màu tiếng Việt ("Đen", "Xanh Navy", "Đen Sọc Trắng"...)
// ---------------------------------------------------------------------------
const COLOR_HEX = [
  ['xanh navy', '#1e3a5f'],
  ['xanh đen', '#1b2a41'],
  ['xanh rêu', '#4d5d3a'],
  ['xanh bích', '#2563eb'],
  ['xanh nhạt', '#93c5fd'],
  ['xanh lá', '#16a34a'],
  ['xanh dương', '#2563eb'],
  ['xanh', '#2f6fdb'],
  ['xám tiêu', '#6b7280'],
  ['xám tro', '#8b8f94'],
  ['xám nhạt', '#d1d5db'],
  ['xám', '#9ca3af'],
  ['trắng', '#ffffff'],
  ['đen', '#1f1f1f'],
  ['be', '#e3d5bd'],
  ['kem', '#f5ecd5'],
  ['nâu', '#8b5e3c'],
  ['đỏ', '#dc2626'],
  ['cam', '#f97316'],
  ['vàng', '#facc15'],
  ['hồng', '#ec4899'],
  ['tím', '#7c3aed'],
  ['ghi', '#6b7280'],
  ['bạc', '#c0c0c0'],
];

export function getColorHex(name) {
  const n = (name || '').trim().toLowerCase();
  const hit = COLOR_HEX.find(([key]) => n === key || n.startsWith(`${key} `));
  return hit ? hit[1] : '#d1d5db';
}

// ---------------------------------------------------------------------------
// Giá khuyến mãi
// ---------------------------------------------------------------------------
export function getSalePrice(product) {
  const sale = product?.productPrice?.salePrice;
  const original = product?.price;
  return sale > 0 && original > 0 && sale < original ? sale : null;
}

// ---------------------------------------------------------------------------
// Biến thể
// ---------------------------------------------------------------------------
function mapVariant(v, index, sellingPrice) {
  const stock = v.stockQuantity ?? 0;
  let warning = null;
  if (stock <= 0) warning = 'Hết hàng';
  else if (stock <= LOW_STOCK_VARIANT) warning = `Chỉ còn ${stock} chiếc`;

  return {
    no: index + 1,
    id: v.id,
    sku: `SKU-${v.id}`,
    color: v.color || '—',
    colorHex: getColorHex(v.color),
    size: v.size || '—',
    cost: v.costPrice != null ? formatVND(v.costPrice) : '—',
    price: formatVND(sellingPrice),
    stock: `${formatNumber(stock)} chiếc`,
    stockQty: stock,
    warning,
  };
}

// ---------------------------------------------------------------------------
// Product (backend) -> view model cho bảng
// ---------------------------------------------------------------------------
export function toProductView(p, { brandMap = {}, categoryMap = {} } = {}) {
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
  const sale = getSalePrice(p);
  const selling = sale ?? p.price;

  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  let statusType = 'active';
  let status = 'Đang bán';
  if (totalStock <= 0) {
    statusType = 'danger';
    status = 'Hết hàng';
  } else if (totalStock <= LOW_STOCK_PRODUCT) {
    statusType = 'warning';
    status = 'Sắp hết hàng';
  }

  let stockSub = `${variants.length} phân loại`;
  if (statusType === 'danger') stockSub = 'Cần nhập thêm hàng';
  else if (statusType === 'warning') stockSub = 'Dưới ngưỡng cảnh báo';

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: `SP-${String(p.id).padStart(4, '0')}`,
    category: categoryMap[p.categoryId] || `Danh mục #${p.categoryId ?? '?'}`,
    brand: brandMap[p.brandId] || `Thương hiệu #${p.brandId ?? '?'}`,
    image: resolveImageUrl(p.primaryImage || p.image || p.images?.[0]),
    hot: Boolean(p.hot ?? p.isHot),
    rating: p.rating,
    views: p.views ?? 0,

    skusCount: `${variants.length} SKU${variants.length > 1 ? 's' : ''}`,
    variantsSummary: variants.length ? `${variants.length} biến thể` : 'Chưa có biến thể',
    variantsDetail: variants.length
      ? `${colors.slice(0, 3).join(' / ')}${colors.length > 3 ? '…' : ''}${sizes.length ? ` · Size ${sizes.join(', ')}` : ''}`
      : 'Thêm size/màu để bán',

    price: formatVND(selling),
    originalPrice: sale ? formatVND(p.price) : null,
    discountPercent: sale ? p.productPrice?.discountPercent ?? Math.round(((p.price - sale) / p.price) * 100) : null,
    hasSale: Boolean(sale),

    totalStock,
    stock: `${formatNumber(totalStock)} chiếc`,
    stockSub,
    status,
    statusType,

    variants: variants.map((v, i) => mapVariant(v, i, selling)),
  };
}

// ---------------------------------------------------------------------------
// Thống kê cho 4 thẻ đầu trang (tính từ toàn bộ sản phẩm)
// ---------------------------------------------------------------------------
export function computeStats(products = [], totalElements = products.length) {
  let totalSkus = 0;
  let lowSkus = 0;
  let outSkus = 0;
  let onSale = 0;
  let hot = 0;
  let inactiveLike = 0; // sản phẩm hết sạch tồn kho

  products.forEach((p) => {
    const variants = Array.isArray(p.variants) ? p.variants : [];
    totalSkus += variants.length;
    let productStock = 0;
    variants.forEach((v) => {
      const q = v.stockQuantity ?? 0;
      productStock += q;
      if (q <= 0) outSkus += 1;
      else if (q <= LOW_STOCK_VARIANT) lowSkus += 1;
    });
    if (productStock <= 0) inactiveLike += 1;
    if (getSalePrice(p)) onSale += 1;
    if (p.hot ?? p.isHot) hot += 1;
  });

  return {
    totalProducts: totalElements,
    totalSkus,
    avgSkus: products.length ? totalSkus / products.length : 0,
    lowSkus,
    outSkus,
    onSale,
    hot,
    outOfStockProducts: inactiveLike,
  };
}
