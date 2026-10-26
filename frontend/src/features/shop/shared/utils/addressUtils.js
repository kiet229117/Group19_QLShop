/**
 * Tiện ích kiểm tra địa chỉ nhận hàng dùng chung cho Hồ sơ & Thanh toán.
 */

// Bỏ dấu tiếng Việt + chữ thường để so khớp ổn định
export function normalizeVietnamese(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Các cụm từ placeholder KHÔNG phải là địa chỉ thật
const PLACEHOLDER_PATTERNS = [
  'chua cap nhat',
  'chua co dia chi',
  'chua nhap',
  'khong co',
  'khong ro',
  'dia chi mac dinh',
  'nhap dia chi',
  'n/a',
  'null',
  'undefined',
];

/** true nếu địa chỉ rỗng hoặc là câu placeholder như "Chưa cập nhật địa chỉ". */
export function isPlaceholderAddress(address) {
  const norm = normalizeVietnamese(address);
  if (!norm) return true;
  return PLACEHOLDER_PATTERNS.some((p) => norm.includes(p));
}

/** Trả về địa chỉ đã trim nếu hợp lệ để điền sẵn, ngược lại trả về chuỗi rỗng. */
export function cleanSavedAddress(address) {
  return isPlaceholderAddress(address) ? '' : String(address).trim();
}

/** Trả về thông báo lỗi ('' nếu hợp lệ). */
export function validateShippingAddress(address) {
  const val = String(address ?? '').trim();
  if (isPlaceholderAddress(val)) {
    return 'Bạn chưa nhập địa chỉ nhận hàng! Vui lòng nhập địa chỉ giao hàng cụ thể (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố).';
  }
  if (val.length < 10 || val.split(/\s+/).length < 3) {
    return 'Địa chỉ nhận hàng chưa đầy đủ (tối thiểu 10 ký tự, gồm số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố).';
  }
  if (val.length > 255) {
    return 'Địa chỉ nhận hàng không được vượt quá 255 ký tự.';
  }
  return '';
}

export function isValidShippingAddress(address) {
  return validateShippingAddress(address) === '';
}

/**
 * Xây dựng sổ địa chỉ giao hàng hợp nhất từ:
 * 1. Địa chỉ chính thức trong database MySQL (users.address / defaultAddress)
 * 2. Các địa chỉ đã lưu thêm trong sổ địa chỉ cá nhân (localStorage theo user)
 * 3. Các địa chỉ giao hàng từ các đơn hàng thực tế đã đặt trong database (orders.shipping_address)
 */
export function buildUserAddressBook(cleanDefaultAddress, user, orders = [], savedExtraAddresses = []) {
  const result = [];
  const seenAddresses = new Set();

  const primaryAddr = cleanSavedAddress(cleanDefaultAddress || user?.address);

  // 1. Địa chỉ mặc định lấy chuẩn từ database (users.address)
  if (primaryAddr && !isPlaceholderAddress(primaryAddr)) {
    seenAddresses.add(primaryAddr.toLowerCase());
    result.push({
      id: 'addr-default',
      label: 'Địa chỉ mặc định',
      recipientName: user?.name || user?.fullname || user?.username || 'Khách hàng',
      phone: user?.phone && String(user.phone).toLowerCase() !== 'chưa cập nhật' ? String(user.phone).trim() : '',
      address: primaryAddr,
      isDefault: true,
    });
  }

  // 2. Các địa chỉ lưu thêm trong sổ địa chỉ cá nhân
  if (Array.isArray(savedExtraAddresses)) {
    savedExtraAddresses.forEach((item, idx) => {
      const addr = cleanSavedAddress(item.address);
      if (addr && !isPlaceholderAddress(addr) && !seenAddresses.has(addr.toLowerCase())) {
        seenAddresses.add(addr.toLowerCase());
        const isDef = result.length === 0 || (primaryAddr && addr.toLowerCase() === primaryAddr.toLowerCase());
        result.push({
          id: item.id || `addr-saved-${idx}`,
          label: item.label || 'Địa chỉ đã lưu',
          recipientName: item.recipientName || user?.name || user?.fullname || 'Khách hàng',
          phone: item.phone || user?.phone || '',
          address: addr,
          isDefault: isDef,
        });
      }
    });
  }

  // 3. Các địa chỉ giao hàng từ lịch sử đơn hàng thực tế trên database (orders)
  if (Array.isArray(orders)) {
    orders.forEach((o) => {
      const addr = cleanSavedAddress(o.shippingAddress);
      if (addr && !isPlaceholderAddress(addr) && !seenAddresses.has(addr.toLowerCase())) {
        seenAddresses.add(addr.toLowerCase());
        const isDef = result.length === 0 || (primaryAddr && addr.toLowerCase() === primaryAddr.toLowerCase());
        result.push({
          id: `addr-order-${o.id}`,
          label: o.code ? `Đơn hàng #${o.code}` : 'Địa chỉ đơn hàng',
          recipientName: o.recipientName || o.receiverName || user?.name || 'Khách hàng',
          phone: o.recipientPhone || o.receiverPhone || user?.phone || '',
          address: addr,
          isDefault: isDef,
        });
      }
    });
  }

  // Đồng bộ trạng thái isDefault
  if (primaryAddr && result.length > 0) {
    const pLower = primaryAddr.toLowerCase();
    result.forEach((item) => {
      item.isDefault = item.address.toLowerCase() === pLower;
    });
  }

  if (result.length > 0 && !result.some((a) => a.isDefault)) {
    result[0].isDefault = true;
  }

  return result;
}


