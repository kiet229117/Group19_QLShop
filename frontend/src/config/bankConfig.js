/**
 * Cấu hình thông tin tài khoản ngân hàng nhận thanh toán của QLShop.
 * Thông tin tài khoản chính thức: MB Bank - 0375003464 - VO ANH KIET
 */

export const SHOP_BANK_ACCOUNT = {
  bankCode: 'MB',
  bin: '970422',
  bankName: 'MB Bank (Ngân hàng TMCP Quân Đội)',
  accountNumber: '0375003464',
  accountName: 'VO ANH KIET',

  /**
   * Tạo URL mã VietQR chuẩn động: Tự động điền số tiền và nội dung chuyển khoản khi quét bằng bất kỳ App ngân hàng nào
   * @param {number} amount Số tiền cần thanh toán
   * @param {string} content Nội dung chuyển khoản (mã đơn hàng)
   * @param {'compact2'|'compact'|'qr_only'} template Mẫu hiển thị ('compact2': có khung MB/Napas; 'qr_only': chỉ mã QR)
   */
  getDynamicQrUrl(amount, content, template = 'compact2') {
    const cleanAmount = Math.max(0, Math.round(Number(amount) || 0));
    const cleanContent = encodeURIComponent(String(content || '').trim());
    const cleanName = encodeURIComponent(this.accountName);
    return `https://img.vietqr.io/image/${this.bankCode}-${this.accountNumber}-${template}.png?amount=${cleanAmount}&addInfo=${cleanContent}&accountName=${cleanName}`;
  },
};

export default SHOP_BANK_ACCOUNT;
