import { useState } from 'react';
import { QrCode, Copy, Check, Download, Building2, User, CreditCard, AlertCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../shared/utils/formatters';
import { toast } from '../../../../components/common/Toast';

export default function VietQRPaymentCard({ order }) {
  const [copiedField, setCopiedField] = useState('');

  if (!order) return null;

  const bankName = 'MB Bank (Ngân hàng TMCP Quân Đội)';
  const bankCode = 'MB';
  const accountNumber = '0901234567';
  const accountName = 'SHOP3AE FASHION';
  const rawAmount = Math.round(Number(order.totalAmount || 0));
  const transferContent = String(order.code || `QL-${order.id}`).trim();

  // URL sinh mã VietQR chuẩn quốc gia NAPAS 24/7
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${rawAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountName)}`;

  const handleCopy = (text, fieldName, label) => {
    navigator.clipboard?.writeText(String(text));
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${label}!`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDownloadQR = () => {
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `VietQR-${transferContent}.png`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.info('Đang mở mã VietQR để lưu hình ảnh...');
  };

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-50/70 via-white to-white p-6 shadow-md sm:p-8 text-left space-y-6">
      {/* Header card */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight text-zinc-900 sm:text-lg">
                Thanh toán chuyển khoản VietQR 24/7
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" />
                Nhanh & Tự động
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Quét mã QR bằng ứng dụng ngân hàng bất kỳ để chuyển tiền tức thì không cần nhập tay.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12 md:items-center">
        {/* Khung mã QR */}
        <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs md:col-span-5">
          <div className="relative overflow-hidden rounded-xl border border-zinc-100 bg-white p-2">
            <img
              src={qrUrl}
              alt={`VietQR thanh toán đơn hàng #${transferContent}`}
              className="h-64 w-64 max-w-full object-contain"
              loading="lazy"
            />
          </div>

          <button
            type="button"
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
          >
            <Download className="h-3.5 w-3.5" />
            Tải ảnh mã QR
          </button>
        </div>

        {/* Thông tin chuyển khoản chi tiết */}
        <div className="space-y-3.5 md:col-span-7">
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
              <span className="font-bold text-zinc-900 uppercase">{accountName}</span>
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
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700"
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
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                {copiedField === 'amount' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>

            {/* Nội dung chuyển khoản */}
            <div className="flex items-center justify-between border-t border-zinc-200/60 pt-2.5">
              <div>
                <p className="text-[11px] font-medium text-zinc-500">Nội dung chuyển khoản (Bắt buộc):</p>
                <p className="font-black text-emerald-700 text-base bg-emerald-100/60 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                  {transferContent}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(transferContent, 'content', 'nội dung chuyển khoản')}
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                {copiedField === 'content' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedField === 'content' ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          {/* Lưu ý thanh toán */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-900 border border-amber-200/70">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Lưu ý:</strong> Vui lòng giữ nguyên nội dung chuyển khoản <strong>{transferContent}</strong> để hệ thống tự động nhận diện và kích hoạt đơn hàng nhanh chóng trong 5–15 phút.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

