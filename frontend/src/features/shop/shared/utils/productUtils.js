/**
 * Các hàm xử lý dữ liệu sản phẩm và hình ảnh cho Client Shop (thuần Frontend, không phụ thuộc Backend).
 */

/** Chuẩn hóa đường dẫn hình ảnh để hiển thị cả ảnh Backend (/uploads/...) và ảnh tĩnh. */
export function resolveShopImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    const backendHost = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(
      /\/api\/?$/,
      ''
    );
    return `${backendHost}${url}`;
  }
  if (url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
}

/** Tính giá hiển thị: chỉ coi là giảm giá khi 0 < salePrice < price. */
export function getProductPricing(product) {
  const original = Number(product?.price);
  const sale = Number(product?.productPrice?.salePrice);
  const hasOriginal = Number.isFinite(original) && original > 0;
  const onSale = hasOriginal && Number.isFinite(sale) && sale > 0 && sale < original;

  let discountPercent = product?.productPrice?.discountPercent ?? null;
  if (onSale && !Number.isFinite(discountPercent)) {
    discountPercent = Math.round(((original - sale) / original) * 100);
  }

  return {
    currentPrice: onSale ? sale : hasOriginal ? original : null,
    originalPrice: onSale ? original : null,
    onSale,
    discountPercent: onSale ? discountPercent : null,
  };
}

/** Danh sách URL ảnh của sản phẩm (ảnh chính đứng đầu). */
export function getProductImages(product) {
  const urls = [];
  const primary = product?.primaryImage || product?.image;
  if (primary) urls.push(primary);
  if (Array.isArray(product?.images)) {
    product.images.forEach((url) => {
      if (url && !urls.includes(url)) urls.push(url);
    });
  }
  return urls.map(resolveShopImageUrl).filter(Boolean);
}

/** Ảnh đại diện của sản phẩm hoặc chuỗi rỗng. */
export function getProductThumbnail(product) {
  return getProductImages(product)[0] || '';
}

/** Tổng tồn kho từ các biến thể. Trả về null nếu sản phẩm không có biến thể nào. */
export function getTotalStock(product) {
  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + (Number(v?.stockQuantity) || 0), 0);
  }
  if (product?.stockQuantity !== undefined && product?.stockQuantity !== null) {
    return Number(product.stockQuantity) || 0;
  }
  if (Array.isArray(product?.variants) && product.variants.length === 0) {
    return 0;
  }
  return null;

}

/** Sản phẩm có biến thể nhưng tất cả đều hết hàng. */
export function isOutOfStock(product) {
  const total = getTotalStock(product);
  return total !== null && total <= 0;
}

/** Sản phẩm sắp hết hàng (tổng tồn kho dưới 10 sản phẩm). */
export function isLowStock(product) {
  const total = getTotalStock(product);
  return total !== null && total > 0 && total < 10;
}

/** Danh sách giá trị duy nhất (giữ thứ tự) của một thuộc tính biến thể (color / size). */
export function getUniqueVariantValues(variants, key) {
  const values = [];
  (variants || []).forEach((variant) => {
    const value = variant?.[key];
    if (value && !values.includes(value)) values.push(value);
  });
  return values;
}

/** Tạo Map id → item từ một danh sách (dùng tra cứu tên danh mục / thương hiệu). */
export function toIdMap(list) {
  const map = new Map();
  (list || []).forEach((item) => {
    if (item?.id !== undefined && item?.id !== null) map.set(String(item.id), item);
  });
  return map;
}
