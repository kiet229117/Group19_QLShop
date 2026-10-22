import { useLocation } from 'react-router-dom';
import { Search, Download, Plus, Bell, MessageSquare } from 'lucide-react';

export default function AdminHeader() {
  const location = useLocation();

  let breadcrumb = {
    group: 'Sản phẩm & Kho',
    page: 'Danh sách sản phẩm & biến thể',
    searchPlaceholder: 'Tìm theo Tên, SKU, Barcode, S... [⌘K]',
    addBtnLabel: 'Thêm sản phẩm mới',
  };

  if (location.pathname.includes('/categories')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Danh mục (Category)',
      searchPlaceholder: 'Tìm kiếm nhanh tên, slug hoặc... [⌘K]',
      addBtnLabel: 'Thêm danh mục',
    };
  } else if (location.pathname.includes('/brands')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Thương hiệu (Brand)',
      searchPlaceholder: 'Tìm kiếm nhanh tên thương hiệu, mã Brand... [⌘K]',
      addBtnLabel: 'Thêm mới',
    };
  } else if (location.pathname.includes('/goods-receipts')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Nhập kho (Goods Receipt)',
      searchPlaceholder: 'Tìm kiếm mã phiếu nhập, NCC (FPT, DGW...)... [⌘K]',
      addBtnLabel: 'Tạo Phiếu Nhập',
    };
  } else if (location.pathname.includes('/suppliers')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Nhà cung cấp (Supplier)',
      searchPlaceholder: 'Tìm kiếm nhà cung cấp, mã số thuế... [⌘K]',
      addBtnLabel: 'Thêm Nhà Cung Cấp',
    };
  } else if (location.pathname.includes('/dashboard')) {
    breadcrumb = {
      group: 'Phân hệ Quản trị',
      page: 'Tổng quan Dashboard',
      searchPlaceholder: 'Tìm kiếm mã đơn #ORD, khách hàng... [⌘K]',
      addBtnLabel: 'Tạo nhanh',
    };
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* 1. Breadcrumb bên trái */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500 font-medium">{breadcrumb.group}</span>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900">{breadcrumb.page}</span>
      </div>

      {/* 2. Ô tìm kiếm + Nút hành động */}
      <div className="flex items-center gap-2.5">
        {/* Ô tìm kiếm */}
        <div className="relative w-64 md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={breadcrumb.searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Nút Xuất file */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition active:scale-95 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>Xuất dữ liệu</span>
        </button>

        {/* Nút Thêm mới */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-xs font-bold text-white transition active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{breadcrumb.addBtnLabel}</span>
        </button>

        {/* Thông báo chuông + Chat */}
        <div className="flex items-center gap-1 text-gray-500 ml-1">
          <button className="p-1.5 hover:text-gray-800 rounded-md hover:bg-gray-100 relative">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
          </button>
          <button className="p-1.5 hover:text-gray-800 rounded-md hover:bg-gray-100">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Đường kẻ phân cách */}
        <div className="h-5 w-px bg-gray-200 mx-1"></div>

        {/* Profile Admin */}
        <div className="flex items-center gap-2 pl-1 select-none">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center border border-emerald-200">
            LM
          </div>
          <div className="text-left hidden xl:block leading-tight">
            <p className="text-xs font-bold text-gray-800">Lê Minh Ngọc</p>
            <p className="text-[10px] text-gray-400 font-medium">Giám đốc Vận hành</p>
          </div>
        </div>
      </div>
    </header>
  );
}
