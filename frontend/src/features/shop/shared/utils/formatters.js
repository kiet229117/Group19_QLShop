const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/** Định dạng số tiền theo VND. Trả về chuỗi rỗng nếu giá trị không hợp lệ. */
export function formatCurrency(value) {
  const number = Number(value);
  if (value === null || value === undefined || !Number.isFinite(number)) return '';
  return currencyFormatter.format(number);
}

/** Định dạng số lượng lớn (VD: lượt xem). */
export function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return new Intl.NumberFormat('vi-VN').format(number);
}
