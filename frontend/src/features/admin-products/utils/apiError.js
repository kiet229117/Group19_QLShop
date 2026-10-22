// Chuyển lỗi axios thành thông báo tiếng Việt dễ hiểu cho người dùng.
export function getApiErrorMessage(err, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.') {
  if (err?.code === 'ERR_NETWORK') {
    return 'Không kết nối được tới máy chủ. Hãy kiểm tra backend (http://localhost:8080) đã chạy chưa.';
  }

  const status = err?.response?.status;
  const data = err?.response?.data;
  const serverMessage = typeof data === 'string' ? data : data?.message;

  // Backend (GlobalExceptionHandler / SecurityConfig) trả JSON { status, message }
  if (serverMessage) return serverMessage;

  if (status === 401) return 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.';
  if (status === 403) return 'Bạn không có quyền thực hiện thao tác này.';
  if (status === 413) return 'Dung lượng ảnh vượt quá giới hạn cho phép của máy chủ.';
  if (status >= 500) return `Máy chủ gặp lỗi (HTTP ${status}). Hãy xem log backend để biết chi tiết.`;

  return err?.message || fallback;
}

export const getErrorStatus = (err) => err?.response?.status;

// Lỗi ràng buộc khóa ngoại khi xóa (sản phẩm đã có trong đơn hàng, phiếu nhập...)
export const isConstraintError = (err) =>
  /foreign key|constraint|integrity|could not execute statement/i.test(getApiErrorMessage(err, ''));
