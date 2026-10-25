/**
 * Xử lý thông tin lỗi giao diện cục bộ trong Client Shop.
 */
export function getShopErrorInfo(error) {
  if (!error) return { type: 'unknown', status: null, message: '' };
  const message =
    typeof error === 'string'
      ? error
      : error?.message || 'Không tìm thấy nội dung yêu cầu trên giao diện.';

  return {
    type: 'notFound',
    status: null,
    message,
  };
}

export function isAbortError(error) {
  return error?.name === 'AbortError';
}
