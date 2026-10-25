import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  Sparkles,
  Ticket,
  Users,
  X,
  Check,
  TrendingUp,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import useVouchers from '../hooks/useVouchers';

export default function VouchersPage() {
  const {
    vouchers,
    loading,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    submitting,
    formData,
    setFormData,
    fetchVouchers,
    handleCreateVoucher,
    handleDeleteVoucher,
    handleCopyCode,
    filteredVouchers,
    stats
  } = useVouchers();

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto text-xs pb-10">
      {/* =========================================================================
          1. HEADER BAR CHUẨN GIAO DIỆN ADMIN
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-5 py-3.5 rounded-2xl border border-gray-200/80 shadow-2xs gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-xs">
            <Ticket className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-gray-900 tracking-tight">
                Voucher &amp; Mã Giảm Giá Shop Áo
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Chiến dịch khuyến mãi
              </span>
            </div>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Phát hành mã voucher giảm giá %, số tiền cố định và hỗ trợ kích cầu mua sắm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchVouchers(false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : 'text-gray-500'}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo Voucher Mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. THỐNG KÊ NHANH (METRIC CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="font-semibold text-[11px]">Tổng Mã Đã Tạo</span>
            <Ticket className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-black text-gray-900">{stats.total}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Mã khuyến mãi toàn shop</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="font-semibold text-[11px]">Đang Có Hiệu Lực</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-800">{stats.active}</div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5">Khách hàng đang áp dụng được</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="font-semibold text-[11px]">Lượt Đã Dùng</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-indigo-700">{stats.totalUsed}</div>
          <div className="text-[10px] text-indigo-600/80 mt-0.5">Lần khách dùng mã tại checkout</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="font-semibold text-[11px]">Mã Giảm Theo %</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-700">{stats.percentageCount}</div>
          <div className="text-[10px] text-amber-600/80 mt-0.5">Khuyến mãi % đơn hàng</div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH TÌM KIẾM & BỘ LỌC
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'ACTIVE', label: 'Đang chạy' },
            { id: 'EXPIRED', label: 'Đã hết hạn' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                statusFilter === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="text-gray-300">|</span>

          {[
            { id: 'ALL', label: 'Mọi loại giảm' },
            { id: 'PERCENTAGE', label: 'Giảm %' },
            { id: 'FIXED_AMOUNT', label: 'Giảm tiền (đ)' }
          ].map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setTypeFilter(type.id)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs transition ${
                typeFilter === type.id
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã voucher, tên chương trình..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none transition"
          />
        </div>
      </div>

      {/* =========================================================================
          4. DANH SÁCH VOUCHER DẠNG COUPON CARDS & TABLE
          ========================================================================= */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-2 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="w-7 h-7 animate-spin text-emerald-700" />
          <p className="font-semibold text-xs">Đang tải danh sách voucher thời trang từ hệ thống...</p>
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
            <Ticket className="w-6 h-6" />
          </div>
          <p className="font-bold text-gray-700 text-sm">Chưa có mã voucher nào</p>
          <p className="text-gray-400 text-xs mt-1">Bấm nút &quot;Tạo Voucher Mới&quot; để phát hành mã giảm giá cho shop áo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredVouchers.map((v) => {
            const now = new Date();
            const isExpired = v.endDate && new Date(v.endDate) < now;
            const isUsedUp = v.usageLimit && v.usedCount >= v.usageLimit;
            const progress = v.usageLimit ? Math.min(Math.round((v.usedCount / v.usageLimit) * 100), 100) : 0;

            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col justify-between transition hover:shadow-md ${
                  isExpired || !v.active
                    ? 'border-gray-200 opacity-75'
                    : 'border-emerald-200/80 hover:border-emerald-400'
                }`}
              >
                {/* Coupon Header */}
                <div className="p-4 bg-gradient-to-r from-emerald-50/60 to-white border-b border-dashed border-gray-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-emerald-800 text-white shadow-2xs tracking-wider">
                        {v.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(v.code)}
                        className="p-1 rounded-md text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Sao chép mã"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      {isExpired ? (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                          Đã hết hạn
                        </span>
                      ) : !v.active ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200">
                          Tạm khóa
                        </span>
                      ) : isUsedUp ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          Hết lượt
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          Đang chạy
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm mt-2.5 line-clamp-1">
                    {v.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">
                    {v.description || 'Ưu đãi thời trang dành cho khách hàng mua áo'}
                  </p>
                </div>

                {/* Coupon Details */}
                <div className="p-4 space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Mức giảm giá:</span>
                    <span className="font-black text-emerald-800 text-xs">
                      {v.discountType === 'PERCENTAGE'
                        ? `Giảm ${v.discountValue}%`
                        : `Giảm ${Number(v.discountValue).toLocaleString('vi-VN')} đ`}
                      {v.maxDiscountAmount ? ` (Tối đa ${Number(v.maxDiscountAmount).toLocaleString('vi-VN')} đ)` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Đơn tối thiểu:</span>
                    <span className="font-semibold text-gray-800">
                      {v.minOrderValue ? `${Number(v.minOrderValue).toLocaleString('vi-VN')} đ` : 'Mọi đơn hàng'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Thời gian áp dụng:</span>
                    <span className="font-medium text-gray-700 flex items-center gap-1 font-mono text-[10px]">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {v.endDate ? new Date(v.endDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                    </span>
                  </div>

                  {/* Thanh tiến độ sử dụng */}
                  <div className="pt-1.5">
                    <div className="flex justify-between text-[10px] text-gray-500 font-semibold mb-1">
                      <span>Đã dùng: {v.usedCount || 0} lượt</span>
                      <span>Giới hạn: {v.usageLimit || '∞'}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Coupon Footer Actions */}
                <div className="p-3 px-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    ID: #{v.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteVoucher(v.id, v.code)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition text-[11px] font-semibold"
                    title="Xóa voucher này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          5. MODAL: TẠO MÃ GIẢM GIÁ MỚI
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Tạo Mã Giảm Giá Mới</h3>
                  <p className="text-xs text-emerald-100/80">Phát hành voucher khuyến mãi cho shop áo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateVoucher} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Mã Voucher */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Mã Voucher (Code) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="VD: POLO20K, HE2026"
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-mono font-bold text-emerald-900 uppercase focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Loại giảm giá */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Loại giảm giá <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-semibold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="PERCENTAGE">Giảm theo % (Phần trăm)</option>
                    <option value="FIXED_AMOUNT">Giảm số tiền cố định (VNĐ)</option>
                  </select>
                </div>
              </div>

              {/* Tên chương trình */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên chương trình voucher <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: Siêu Sale Áo Polo Đón Hè"
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả điều kiện áp dụng</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="VD: Áp dụng cho đơn hàng mua áo thun và áo polo từ 300k"
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-emerald-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Giá trị giảm */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {formData.discountType === 'PERCENTAGE' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (đ)'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Giảm tối đa (nếu là %) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Giảm tối đa (đ) {formData.discountType === 'PERCENTAGE' && <span className="text-gray-400 font-normal">(Tùy chọn)</span>}
                  </label>
                  <input
                    type="number"
                    disabled={formData.discountType === 'FIXED_AMOUNT'}
                    value={formData.maxDiscountAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                    placeholder="VD: 50000"
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 disabled:opacity-40 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Đơn tối thiểu */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn tối thiểu (đ)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Giới hạn lượt dùng */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tổng lượt dùng</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Ngày bắt đầu */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-emerald-600 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                {/* Ngày kết thúc */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-emerald-600 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Phát Hành Voucher</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

