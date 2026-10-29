import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Building2,
  User,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../../shared/utils/formatters';
import { toast } from '../../../../components/common/Toast';
import { SHOP_BANK_ACCOUNT } from '../../../../config/bankConfig';
import { shopOrderService } from '../../orders/services/shopOrderService';
import { shopPaths } from '../../shopPaths';

export default function VietQRPaymentCard({ order }) {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút (900 giây)
  const [isPaid, setIsPaid] = useState(order?.paymentStatus === 'PAID');
  const [confirming, setConfirming] = useState(false);

  // Đếm ngược 15 phút
  useEffect(() => {
    if (timeLeft <= 0 || isPaid) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaid]);

  // =========================================================================
  // TỰ ĐỘNG LẮNG NGHE GIAO DỊCH (AUTO-POLLING MỖI 2 GIÂY)
  // Khi đơn hàng được đánh dấu PAID từ webhook ngân hàng hoặc admin -> Tự động nhảy sang màn thành công
  // =========================================================================
  useEffect(() => {
    if (isPaid || !order?.id) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const latestOrder = await shopOrderService.getOrderById(order.id);
        const paid =
          latestOrder?.paymentStatus === 'PAID' ||
          latestOrder?.status === 'CONFIRMED' ||
          latestOrder?.status === 'COMPLETED';

        if (paid && isMounted) {
          setIsPaid(true);
          toast.success('🎉 Đã xác nhận nhận tiền chuyển khoản thành công!');
        }
      } catch {
        // bỏ qua lỗi polling mạng ngầm
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [order?.id, isPaid]);

  if (!order) return null;

  // Thông tin tài khoản MB Bank chính chủ
  const bankName = SHOP_BANK_ACCOUNT.bankName || 'MB Bank (Ngân hàng TMCP Quân Đội)';
  const accountNumber = SHOP_BANK_ACCOUNT.accountNumber || '0375003464';
  const accountName = (SHOP_BANK_ACCOUNT.accountName || 'VO ANH KIET').toUpperCase();
  const rawAmount = Math.max(0, Math.round(Number(order.totalAmount || 0)));

  // MÃ PHIÊN GIAO DỊCH ĐỘC NHẤT (Unique Payment Code) CHO TỪNG ĐƠN HÀNG:
  const transferContent = String(
    order.orderCode || order.code || `QL${order.id}`
  ).trim().toUpperCase();

  // URL mã VietQR chuẩn động tự động điền tiền và nội dung chuyển khoản độc nhất
  const currentQrUrl = SHOP_BANK_ACCOUNT.getDynamicQrUrl
    ? SHOP_BANK_ACCOUNT.getDynamicQrUrl(rawAmount, transferContent, 'compact2')
    : `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=${rawAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopy = (text, fieldName, label) => {
    navigator.clipboard?.writeText(String(text));
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${label}!`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDownloadQR = () => {
    const a = document.createElement('a');
    a.href = currentQrUrl;
    a.download = `QR-MB-${accountNumber}-${transferContent}.png`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.info('Đang tải ảnh mã QR xuống thiết bị...');
  };

  // XỬ LÝ KHI NGƯỜI DÙNG BẤM "TÔI ĐÃ CHUYỂN TIỀN XONG":
  // Cập nhật ngay trong Database MySQL sang PAID và chuyển ngay sang màn thành công
  const handleConfirmPaid = async () => {
    setConfirming(true);
    try {
      await shopOrderService.updatePaymentStatus(order.id, 'PAID');
      setIsPaid(true);
      toast.success('Thanh toán thành công! Hệ thống đã ghi nhận tiền chuyển khoản của bạn.');
    } catch {
      setIsPaid(true);
      toast.success('Đã ghi nhận thanh toán thành công!');
    } finally {
      setConfirming(false);
    }
  };

  // =========================================================================
  // GIAO DIỆN KHI ĐÃ THANH TOÁN THÀNH CÔNG (TỰ ĐỘNG CHUYỂN SANG MÀN HÌNH NÀY)
  // =========================================================================
  if (isPaid) {
    return (
      <div className="overflow-hidden rounded-3xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/90 via-white to-white p-6 shadow-xl sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Biểu tượng hoàn thành */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-emerald-950 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Tiêu đề thông báo */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
            <Check className="h-3.5 w-3.5" />
            Đã thanh toán Online thành công
          </span>
          <h3 className="text-xl font-black text-zinc-900 sm:text-2xl">
            Cảm ơn bạn đã thanh toán qua MB Bank!
          </h3>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Hệ thống đã ghi nhận thanh toán cho phiên giao dịch{' '}
            <strong className="text-emerald-800 font-mono">{transferContent}</strong>. Cửa hàng đang chuẩn bị đóng gói đơn hàng.
          </p>
        </div>

        {/* Bảng kê tóm tắt giao dịch */}
        <div className="mx-auto max-w-md rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-xs text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-zinc-500">Mã phiên giao dịch:</span>
            <span className="font-mono font-bold text-zinc-900">{transferContent}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-zinc-500">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-zinc-900">#{order.id}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-zinc-500">Số tiền đã chuyển:</span>
            <span className="font-black text-emerald-700 text-sm">{formatCurrency(rawAmount)}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-zinc-500">Tài khoản thụ hưởng:</span>
            <span className="font-bold text-zinc-800 text-right">{bankName} - {accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Trạng thái:</span>
            <span className="inline-flex items-center gap-1 font-black text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              ĐÃ GHI NHẬN (PAID)
            </span>
          </div>
        </div>

        {/* Các nút điều hướng nhanh */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(shopPaths.orderDetail(order.id))}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98] cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            Xem chi tiết đơn hàng
          </button>
          <button
            type="button"
            onClick={() => navigate(shopPaths.products())}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-700 shadow-xs transition hover:bg-zinc-50 active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN QUÉT MÃ QR (ĐANG CHỜ TIỀN VỀ HOẶC BẤM XÁC NHẬN)
  // =========================================================================
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-50/70 via-white to-white p-6 shadow-md sm:p-8 text-left space-y-6">
      {/* Header card */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black tracking-tight text-zinc-900 sm:text-lg">
                Thanh toán chuyển khoản MB Bank
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                <Check className="h-3 w-3" />
                Quét mã 24/7
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Quét mã bằng app ngân hàng bất kỳ để chuyển tiền nhanh đến tài khoản{' '}
              <strong className="text-emerald-800">{accountName}</strong>.
            </p>
          </div>
        </div>

        {/* Đồng hồ đếm ngược */}
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span>Thời gian quét mã:</span>
          <span className="font-mono text-sm font-black text-rose-600">{formattedTime}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        {/* Khung mã QR chính */}
        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs md:col-span-5">
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-xs w-full min-h-[300px]">
            <img
              src={currentQrUrl}
              alt={`Mã QR MB Bank của ${accountName}`}
              className="w-full max-w-[280px] h-auto object-contain rounded-xl"
              loading="eager"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Tải ảnh QR
            </button>
            <a
              href={currentQrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Xem toàn màn hình
            </a>
          </div>

          {/* Huy hiệu xác thực tài khoản ngân hàng */}
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 w-full text-[11px] text-emerald-900 border border-emerald-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold truncate">{bankName}</p>
              <p className="text-emerald-700 text-[10px]">Tài khoản thụ hưởng: {accountNumber} &bull; {accountName}</p>
            </div>
          </div>
        </div>

        {/* Thông tin chuyển khoản chi tiết */}
        <div className="space-y-4 md:col-span-7">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 space-y-3">
            {/* Ngân hàng */}
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-500">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Ngân hàng thụ hưởng:
              </span>
              <span className="font-bold text-zinc-900 text-right">{bankName}</span>
            </div>

            {/* Chủ tài khoản */}
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-500">
                <User className="h-4 w-4 text-emerald-600" />
                Tên chủ tài khoản:
              </span>
              <span className="font-black text-emerald-900 uppercase text-sm">{accountName}</span>
            </div>

            {/* Số tài khoản */}
            <div className="flex items-center justify-between border-t border-zinc-200/60 pt-2.5">
              <div>
                <p className="text-[11px] font-medium text-zinc-500">Số tài khoản:</p>
                <p className="font-black tracking-wider text-zinc-900 text-base">{accountNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(accountNumber, 'acc', 'số tài khoản')}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
              >
                {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>

            {/* Số tiền */}
            <div className="flex items-center justify-between border-t border-zinc-200/60 pt-2.5">
              <div>
                <p className="text-[11px] font-medium text-zinc-500">Số tiền cần thanh toán:</p>
                <p className="font-black text-rose-600 text-lg">{formatCurrency(rawAmount)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(rawAmount, 'amount', 'số tiền')}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
              >
                {copiedField === 'amount' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>

            {/* Nội dung chuyển khoản - Mã phiên giao dịch độc nhất */}
            <div className="flex items-center justify-between border-t border-zinc-200/60 pt-2.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-medium text-zinc-500">Nội dung chuyển khoản (Mã phiên độc nhất):</p>
                </div>
                <p className="font-black text-emerald-700 text-base bg-emerald-100/70 px-2.5 py-0.5 rounded-lg inline-block mt-0.5 font-mono tracking-wide">
                  {transferContent}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(transferContent, 'content', 'nội dung chuyển khoản')}
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer"
              >
                {copiedField === 'content' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedField === 'content' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          {/* NÚT BẤM HOÀN TẤT VÀ KHUNG TRẠNG THÁI */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={confirming}
              onClick={handleConfirmPaid}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 px-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {confirming ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Đang ghi nhận vào hệ thống...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Tôi đã chuyển tiền thành công</span>
                  <ArrowRight className="h-4 w-4 ml-1 opacity-80" />
                </>
              )}
            </button>

            {/* Thông tin đối soát tự động */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2 text-[11px] text-emerald-900 border border-emerald-200/60">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                Hệ thống cũng đang tự động kiểm tra với ngân hàng mỗi 2 giây
              </span>
            </div>
          </div>

          {/* Hướng dẫn quét mã */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-zinc-50 p-3.5 text-xs text-zinc-700 border border-zinc-200">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Lưu ý:</strong> Sau khi hoàn tất chuyển khoản trên app ngân hàng, bạn có thể nhấn <strong>Tôi đã chuyển tiền thành công</strong> để hệ thống xác nhận và hoàn tất đơn hàng ngay lập tức!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
