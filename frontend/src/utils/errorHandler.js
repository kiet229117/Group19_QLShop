/**
 * Chuyển đổi mã lỗi và thông báo lỗi thô từ Backend thành thông điệp thân thiện với người dùng
 */
export function getFriendlyErrorMessage(err, defaultMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại!') {
  if (!err) return defaultMessage;

  // 1. Nếu là chuỗi
  if (typeof err === 'string') {
    return cleanRawErrorString(err) || defaultMessage;
  }

  // 2. Lấy message từ axios response
  const serverMsg =
    err.response?.data?.message ||
    err.response?.data?.error ||
    (typeof err.response?.data === 'string' ? err.response.data : null) ||
    err.message;

  if (serverMsg) {
    return cleanRawErrorString(serverMsg) || defaultMessage;
  }

  return defaultMessage;
}

function cleanRawErrorString(msg) {
  if (!msg || typeof msg !== 'string') return '';

  // Nhận diện lỗi sai tài khoản hoặc mật khẩu đăng nhập
  if (
    msg.toLowerCase().includes('bad credentials') ||
    msg.includes('Bad credentials')
  ) {
    return 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!';
  }

  // Nhận diện lỗi tài khoản bị khóa
  if (
    msg.includes('User is disabled') ||
    msg.includes('User account is locked')
  ) {
    return 'Tài khoản của bạn đã bị khóa hoặc tạm ngưng hoạt động. Vui lòng liên hệ quản trị viên!';
  }

  // Nhận diện lỗi ràng buộc khóa ngoại (Foreign key constraint)
  if (
    msg.includes('foreign key constraint fails') ||
    msg.includes('Cannot delete or update a parent row') ||
    msg.includes('fk_order_user') ||
    msg.includes('DataIntegrityViolationException')
  ) {
    if (msg.includes('order')) {
      return 'Không thể xóa dữ liệu này vì đã có lịch sử đơn hàng liên quan. Bạn có thể sử dụng chức năng Khóa tài khoản hoặc Tạm ẩn.';
    }
    return 'Không thể xóa bản ghi này vì đang được liên kết với dữ liệu khác trong hệ thống (đơn hàng, đánh giá, hội thoại...).';
  }

  // Nhận diện lỗi trùng lặp dữ liệu Unique key (Duplicate entry)
  if (msg.includes('Duplicate entry')) {
    if (msg.includes('username') || msg.includes('users')) {
      return 'Tên đăng nhập hoặc Email này đã tồn tại trong hệ thống. Vui lòng chọn thông tin khác!';
    }
    return 'Dữ liệu này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại thông tin trùng lặp!';
  }

  // Lọc sạch các cú pháp lỗi SQL, Hibernate hoặc stacktrace
  if (
    msg.includes('could not execute statement') ||
    msg.includes('SQL [') ||
    msg.includes('JDBC exception') ||
    msg.includes('org.hibernate') ||
    msg.includes('ConstraintViolationException')
  ) {
    return 'Thao tác không hợp lệ do vi phạm ràng buộc dữ liệu trong hệ thống.';
  }

  // Lỗi mạng hoặc server không phản hồi
  if (msg.includes('Network Error') || msg.includes('ERR_CONNECTION_REFUSED')) {
    return 'Không thể kết nối đến máy chủ Backend (Port 8080). Vui lòng kiểm tra lại dịch vụ!';
  }

  return msg;
}

export default getFriendlyErrorMessage;

