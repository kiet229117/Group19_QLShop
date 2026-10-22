import { Fragment, useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD
import { Link, useSearchParams } from 'react-router-dom';
=======
import { Link } from 'react-router-dom';
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
import axios from 'axios';
import {
  Package,
  Layers,
  AlertTriangle,
  BadgePercent,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
  X,
  Info,
  RefreshCw,
  Search,
  Flame,
  ImageOff,
<<<<<<< HEAD
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  CheckCircle2,
=======
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
} from 'lucide-react';
import {
  getProducts,
  getCategories,
  getBrands,
} from '../services/productService';
import {
  toProductView,
  computeStats,
  formatNumber,
  formatVND,
} from '../utils/productMapper';
<<<<<<< HEAD
import { getApiErrorMessage as getErrorMessage } from '../utils/apiError';
import { getMe, logout, canWriteProducts, canDeleteProducts, normalizeRole } from '../../../services/authService';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import LoginModal from '../components/LoginModal';
=======
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3

// ---------------------------------------------------------------------------
// Hằng số & helper
// ---------------------------------------------------------------------------
const INITIAL_FILTERS = {
  keyword: '',
  categoryId: '',
  brandId: '',
  inStock: false,
  minPrice: '',
  maxPrice: '',
  shirtSize: '',
  color: '',
  hasSale: false,
  isHot: false,
  sortBy: 'newest',
};

const PAGE_SIZES = [10, 20, 50, 100];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'popular', label: 'Xem nhiều nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

<<<<<<< HEAD
=======
function getErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ERR_NETWORK') {
    return 'Không kết nối được tới máy chủ. Hãy kiểm tra backend (http://localhost:8080) đã chạy chưa.';
  }
  return err?.message || 'Đã có lỗi xảy ra khi tải dữ liệu.';
}

>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
// ---------------------------------------------------------------------------
// Component con
// ---------------------------------------------------------------------------
function FilterSelect({ value, onChange, children, active }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none pl-3 pr-8 py-1.5 rounded-md border font-medium transition focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
          active
            ? 'border-emerald-600/40 bg-emerald-50/60 text-emerald-800'
            : 'border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700'
        }`}
      >
        {children}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

function ProductThumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-300 flex items-center justify-center">
        <ImageOff className="w-4 h-4" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-2xs"
    />
  );
}

const STATUS_STYLES = {
  active: { wrap: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  warning: { wrap: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  danger: { wrap: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  draft: { wrap: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

function StatusBadge({ type, label }) {
  const s = STATUS_STYLES[type] || STATUS_STYLES.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${s.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {label}
    </span>
  );
}

function FilterTag({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium border border-gray-200">
      {label}: <strong>{value}</strong>
      <button type="button" onClick={onRemove} aria-label={`Xóa bộ lọc ${label}`}>
        <X className="w-3 h-3 cursor-pointer hover:text-gray-900" />
      </button>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Trang chính
// ---------------------------------------------------------------------------
export default function ProductsPage() {
  // --- Bộ lọc / phân trang ---
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [reloadKey, setReloadKey] = useState(0);

  // --- UI ---
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState({ min: '', max: '' });

  // --- Dữ liệu từ API ---
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stats, setStats] = useState(null);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  const debouncedFilters = useDebounce(filters, 400);

<<<<<<< HEAD
  // --- Đăng nhập / phân quyền (thêm, sửa: ADMIN + STAFF; xóa: chỉ ADMIN) ---
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const canWrite = canWriteProducts(user);
  const canDelete = canDeleteProducts(user);

  // --- Thêm / Sửa / Xóa ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [formState, setFormState] = useState(null); // { mode: 'create' | 'edit', product }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Nút "Thêm sản phẩm mới" ở header/sidebar điều hướng tới /admin/products?new=1
  const createFromUrl = searchParams.get('new') === '1';
  const formOpen = formState ?? (createFromUrl ? { mode: 'create', product: null } : null);

  const auth = {
    user,
    canWrite,
    canDelete,
    requestLogin: () => setLoginOpen(true),
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPriceDraft({ min: '', max: '' });
    setPage(0);
  };

  // 0. Kiểm tra phiên đăng nhập hiện tại (cookie)
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Tự ẩn thông báo sau vài giây
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 1. Tải danh mục + thương hiệu (để đổ vào dropdown và hiển thị tên)
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getCategories(), getBrands()]).then(([cats, brs]) => {
      if (cancelled) return;
      if (cats.status === 'fulfilled') setCategories(cats.value);
      if (brs.status === 'fulfilled') setBrands(brs.value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Tải số liệu thống kê cho 4 thẻ đầu trang
  useEffect(() => {
    const controller = new AbortController();
    getProducts({ page: 0, pageSize: 1000, sortBy: 'newest' }, { signal: controller.signal })
      .then((data) => setStats(computeStats(data.content ?? [], data.totalElements)))
      .catch(() => {
        /* thẻ thống kê không chặn trang nếu lỗi */
      });
    return () => controller.abort();
  }, [reloadKey]);

  // 3. Tải danh sách sản phẩm theo bộ lọc + phân trang
  const requestKey = JSON.stringify({ ...debouncedFilters, page, pageSize, reloadKey });

  useEffect(() => {
    const controller = new AbortController();
    const { page: p, pageSize: size, reloadKey: _r, ...f } = JSON.parse(requestKey);
    void _r;

    getProducts(
      {
        keyword: f.keyword.trim(),
        categoryId: f.categoryId,
        brandId: f.brandId,
        inStock: f.inStock,
        minPrice: f.minPrice,
        maxPrice: f.maxPrice,
        shirtSize: f.shirtSize,
        color: f.color.trim(),
        hasSale: f.hasSale,
        isHot: f.isHot,
        sortBy: f.sortBy,
        page: p,
        pageSize: size,
      },
      { signal: controller.signal },
    )
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setResult({ key: requestKey, data: null, error: err });
      });

    return () => controller.abort();
  }, [requestKey]);

  const loading = result.key !== requestKey;
  const data = result.data;

  // --- Chuyển dữ liệu backend -> view model ---
  const brandMap = useMemo(() => Object.fromEntries(brands.map((b) => [b.id, b.name])), [brands]);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const products = useMemo(
    () => (data?.content ?? []).map((p) => toProductView(p, { brandMap, categoryMap })),
    [data, brandMap, categoryMap],
  );

  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const from = products.length ? (data?.number ?? 0) * (data?.size ?? pageSize) + 1 : 0;
  const to = products.length ? from + products.length - 1 : 0;

  // --- Chọn dòng ---
  const allOnPageSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) products.forEach((p) => next.delete(p.id));
      else products.forEach((p) => next.add(p.id));
      return next;
    });

  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  // --- Tag bộ lọc đang áp dụng ---
  const activeTags = [];
  if (filters.keyword.trim()) {
    activeTags.push({ key: 'keyword', label: 'Từ khóa', value: filters.keyword.trim(), clear: () => updateFilter('keyword', '') });
  }
  if (filters.categoryId) {
    activeTags.push({ key: 'categoryId', label: 'Danh mục', value: categoryMap[filters.categoryId] || `#${filters.categoryId}`, clear: () => updateFilter('categoryId', '') });
  }
  if (filters.brandId) {
    activeTags.push({ key: 'brandId', label: 'Thương hiệu', value: brandMap[filters.brandId] || `#${filters.brandId}`, clear: () => updateFilter('brandId', '') });
  }
  if (filters.inStock) {
    activeTags.push({ key: 'inStock', label: 'Tồn kho', value: 'Còn hàng', clear: () => updateFilter('inStock', false) });
  }
  if (filters.minPrice !== '' || filters.maxPrice !== '') {
    const min = filters.minPrice !== '' ? formatVND(filters.minPrice) : '0đ';
    const max = filters.maxPrice !== '' ? formatVND(filters.maxPrice) : '∞';
    activeTags.push({
      key: 'price',
      label: 'Giá',
      value: `${min} – ${max}`,
      clear: () => {
        setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }));
        setPriceDraft({ min: '', max: '' });
        setPage(0);
      },
    });
  }
  if (filters.shirtSize) {
    activeTags.push({ key: 'shirtSize', label: 'Size', value: filters.shirtSize, clear: () => updateFilter('shirtSize', '') });
  }
  if (filters.color.trim()) {
    activeTags.push({ key: 'color', label: 'Màu', value: filters.color.trim(), clear: () => updateFilter('color', '') });
  }
  if (filters.hasSale) {
    activeTags.push({ key: 'hasSale', label: 'Khuyến mãi', value: 'Đang giảm giá', clear: () => updateFilter('hasSale', false) });
  }
  if (filters.isHot) {
    activeTags.push({ key: 'isHot', label: 'Nổi bật', value: 'Sản phẩm hot', clear: () => updateFilter('isHot', false) });
  }
  if (filters.sortBy !== 'newest') {
    const label = SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label;
    activeTags.push({ key: 'sortBy', label: 'Sắp xếp', value: label, clear: () => updateFilter('sortBy', 'newest') });
  }

  const advancedActive = Boolean(
    filters.shirtSize || filters.color.trim() || filters.hasSale || filters.isHot || filters.sortBy !== 'newest',
  );

  const applyPrice = () => {
    setFilters((prev) => ({ ...prev, minPrice: priceDraft.min, maxPrice: priceDraft.max }));
    setPage(0);
    setPriceOpen(false);
  };

  // --- Phân trang: cửa sổ tối đa 5 số trang ---
  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];
    const start = Math.max(0, Math.min(page - 2, totalPages - 5));
    const end = Math.min(totalPages, start + 5);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [page, totalPages]);

  const statValue = (v) => (stats ? v : '—');

  // --- Handlers thêm / sửa / xóa ---
  const closeForm = () => {
    setFormState(null);
    if (createFromUrl) setSearchParams({}, { replace: true });
  };

  const openCreate = () => setFormState({ mode: 'create', product: null });
  const openEdit = (p) => setFormState({ mode: 'edit', product: p.raw });

  const openDelete = (p) => {
    if (user && !canDelete) {
      setToast({ type: 'error', text: 'Chỉ tài khoản ADMIN mới được xóa sản phẩm.' });
      return;
    }
    setDeleteTarget(p);
  };

  const handleSaved = ({ mode, warning }) => {
    closeForm();
    if (mode === 'create') resetFilters(); // về trang 1, sắp xếp mới nhất để thấy sản phẩm vừa thêm
    setReloadKey((k) => k + 1);
    setToast(
      warning
        ? { type: 'warning', text: `Đã lưu sản phẩm nhưng ${warning}` }
        : {
            type: 'success',
            text: mode === 'create' ? 'Đã thêm sản phẩm mới vào database.' : 'Đã cập nhật sản phẩm trong database.',
          },
    );
  };

  const handleDeleted = (deleted) => {
    setDeleteTarget(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleted.id);
      return next;
    });
    setExpandedId((cur) => (cur === deleted.id ? null : cur));
    if (products.length === 1 && page > 0) setPage((p) => p - 1); // xóa hết dòng cuối của trang
    setReloadKey((k) => k + 1);
    setToast({ type: 'success', text: `Đã xóa "${deleted.name}" khỏi database.` });
  };

  const handleLoginSuccess = (u) => {
    setUser(u);
    setLoginOpen(false);
    setToast({ type: 'success', text: `Đã đăng nhập: ${u.username} (${normalizeRole(u).toUpperCase()}).` });
  };

  const handleLogout = () => {
    logout()
      .catch(() => {})
      .finally(() => {
        setUser(null);
        setToast({ type: 'success', text: 'Đã đăng xuất.' });
      });
=======
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPriceDraft({ min: '', max: '' });
    setPage(0);
  };

  // 1. Tải danh mục + thương hiệu (để đổ vào dropdown và hiển thị tên)
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getCategories(), getBrands()]).then(([cats, brs]) => {
      if (cancelled) return;
      if (cats.status === 'fulfilled') setCategories(cats.value);
      if (brs.status === 'fulfilled') setBrands(brs.value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Tải số liệu thống kê cho 4 thẻ đầu trang
  useEffect(() => {
    const controller = new AbortController();
    getProducts({ page: 0, pageSize: 1000, sortBy: 'newest' }, { signal: controller.signal })
      .then((data) => setStats(computeStats(data.content ?? [], data.totalElements)))
      .catch(() => {
        /* thẻ thống kê không chặn trang nếu lỗi */
      });
    return () => controller.abort();
  }, [reloadKey]);

  // 3. Tải danh sách sản phẩm theo bộ lọc + phân trang
  const requestKey = JSON.stringify({ ...debouncedFilters, page, pageSize, reloadKey });

  useEffect(() => {
    const controller = new AbortController();
    const { page: p, pageSize: size, reloadKey: _r, ...f } = JSON.parse(requestKey);
    void _r;

    getProducts(
      {
        keyword: f.keyword.trim(),
        categoryId: f.categoryId,
        brandId: f.brandId,
        inStock: f.inStock,
        minPrice: f.minPrice,
        maxPrice: f.maxPrice,
        shirtSize: f.shirtSize,
        color: f.color.trim(),
        hasSale: f.hasSale,
        isHot: f.isHot,
        sortBy: f.sortBy,
        page: p,
        pageSize: size,
      },
      { signal: controller.signal },
    )
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setResult({ key: requestKey, data: null, error: err });
      });

    return () => controller.abort();
  }, [requestKey]);

  const loading = result.key !== requestKey;
  const data = result.data;

  // --- Chuyển dữ liệu backend -> view model ---
  const brandMap = useMemo(() => Object.fromEntries(brands.map((b) => [b.id, b.name])), [brands]);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const products = useMemo(
    () => (data?.content ?? []).map((p) => toProductView(p, { brandMap, categoryMap })),
    [data, brandMap, categoryMap],
  );

  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const from = products.length ? (data?.number ?? 0) * (data?.size ?? pageSize) + 1 : 0;
  const to = products.length ? from + products.length - 1 : 0;

  // --- Chọn dòng ---
  const allOnPageSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));

  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) products.forEach((p) => next.delete(p.id));
      else products.forEach((p) => next.add(p.id));
      return next;
    });

  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  // --- Tag bộ lọc đang áp dụng ---
  const activeTags = [];
  if (filters.keyword.trim()) {
    activeTags.push({ key: 'keyword', label: 'Từ khóa', value: filters.keyword.trim(), clear: () => updateFilter('keyword', '') });
  }
  if (filters.categoryId) {
    activeTags.push({ key: 'categoryId', label: 'Danh mục', value: categoryMap[filters.categoryId] || `#${filters.categoryId}`, clear: () => updateFilter('categoryId', '') });
  }
  if (filters.brandId) {
    activeTags.push({ key: 'brandId', label: 'Thương hiệu', value: brandMap[filters.brandId] || `#${filters.brandId}`, clear: () => updateFilter('brandId', '') });
  }
  if (filters.inStock) {
    activeTags.push({ key: 'inStock', label: 'Tồn kho', value: 'Còn hàng', clear: () => updateFilter('inStock', false) });
  }
  if (filters.minPrice !== '' || filters.maxPrice !== '') {
    const min = filters.minPrice !== '' ? formatVND(filters.minPrice) : '0đ';
    const max = filters.maxPrice !== '' ? formatVND(filters.maxPrice) : '∞';
    activeTags.push({
      key: 'price',
      label: 'Giá',
      value: `${min} – ${max}`,
      clear: () => {
        setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }));
        setPriceDraft({ min: '', max: '' });
        setPage(0);
      },
    });
  }
  if (filters.shirtSize) {
    activeTags.push({ key: 'shirtSize', label: 'Size', value: filters.shirtSize, clear: () => updateFilter('shirtSize', '') });
  }
  if (filters.color.trim()) {
    activeTags.push({ key: 'color', label: 'Màu', value: filters.color.trim(), clear: () => updateFilter('color', '') });
  }
  if (filters.hasSale) {
    activeTags.push({ key: 'hasSale', label: 'Khuyến mãi', value: 'Đang giảm giá', clear: () => updateFilter('hasSale', false) });
  }
  if (filters.isHot) {
    activeTags.push({ key: 'isHot', label: 'Nổi bật', value: 'Sản phẩm hot', clear: () => updateFilter('isHot', false) });
  }
  if (filters.sortBy !== 'newest') {
    const label = SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label;
    activeTags.push({ key: 'sortBy', label: 'Sắp xếp', value: label, clear: () => updateFilter('sortBy', 'newest') });
  }

  const advancedActive = Boolean(
    filters.shirtSize || filters.color.trim() || filters.hasSale || filters.isHot || filters.sortBy !== 'newest',
  );

  const applyPrice = () => {
    setFilters((prev) => ({ ...prev, minPrice: priceDraft.min, maxPrice: priceDraft.max }));
    setPage(0);
    setPriceOpen(false);
  };

  // --- Phân trang: cửa sổ tối đa 5 số trang ---
  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];
    const start = Math.max(0, Math.min(page - 2, totalPages - 5));
    const end = Math.min(totalPages, start + 5);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [page, totalPages]);

  const statValue = (v) => (stats ? v : '—');

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-xs pb-10">
      {/* =========================================================================
          1. HÀNG 4 THẺ THỐNG KÊ (TOP CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số sản phẩm */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số sản phẩm
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {statValue(formatNumber(stats?.totalProducts))}
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              {stats ? `${formatNumber(stats.hot)} sản phẩm nổi bật (hot)` : 'Đang tải...'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Tổng biến thể (SKUs) */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Tổng biến thể (SKUs)
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {statValue(formatNumber(stats?.totalSkus))}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-700">
                {stats ? `TB ${stats.avgSkus.toFixed(1)} biến thể / SP` : '—'}
              </span>{' '}
              | Size, Màu sắc
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Cảnh báo sắp hết hàng */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo sắp hết hàng
            </span>
            <div className="text-2xl font-black text-amber-700 mt-1">
              {statValue(formatNumber(stats?.lowSkus))}{' '}
              <span className="text-sm font-semibold">SKU cần nhập</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className="text-rose-600 font-bold">
                {stats ? `${formatNumber(stats.outSkus)} SKU đã hết tồn kho` : '—'}
              </span>
              <Link to="/admin/goods-receipts" className="text-emerald-700 hover:underline font-semibold ml-1">
                Lập phiếu nhập &rarr;
              </Link>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Đang khuyến mãi */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Đang khuyến mãi
            </span>
            <div className="text-2xl font-black text-gray-800 mt-1">
              {statValue(formatNumber(stats?.onSale))}{' '}
              <span className="text-sm font-semibold">sản phẩm</span>
            </div>
            <div className="mt-1 text-[11px] text-gray-400">
              {stats ? `${formatNumber(stats.outOfStockProducts)} sản phẩm đã hết hàng hoàn toàn` : '—'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 border border-gray-200 flex items-center justify-center shrink-0">
            <BadgePercent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. THANH BỘ LỌC TÌM KIẾM & BỘ LỌC ĐANG ÁP DỤNG
          ========================================================================= */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Ô tìm kiếm */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                placeholder="Tìm theo tên / mô tả..."
                className="w-52 pl-8 pr-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <FilterSelect
              value={filters.categoryId}
              onChange={(v) => updateFilter('categoryId', v)}
              active={Boolean(filters.categoryId)}
            >
              <option value="">Tất cả Danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={filters.brandId}
              onChange={(v) => updateFilter('brandId', v)}
              active={Boolean(filters.brandId)}
            >
              <option value="">Tất cả Thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={filters.inStock ? 'in' : ''}
              onChange={(v) => updateFilter('inStock', v === 'in')}
              active={filters.inStock}
            >
              <option value="">Tình trạng tồn kho</option>
              <option value="in">Còn hàng</option>
            </FilterSelect>

            {/* Khoảng giá */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPriceOpen((o) => !o)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-medium transition ${
                  filters.minPrice !== '' || filters.maxPrice !== ''
                    ? 'border-emerald-600/40 bg-emerald-50/60 text-emerald-800'
                    : 'border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>Khoảng giá</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {priceOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPriceOpen(false)} />
                  <div className="absolute z-20 mt-1.5 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Từ (đ)"
                        value={priceDraft.min}
                        onChange={(e) => setPriceDraft((d) => ({ ...d, min: e.target.value }))}
                        className="px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Đến (đ)"
                        value={priceDraft.max}
                        onChange={(e) => setPriceDraft((d) => ({ ...d, max: e.target.value }))}
                        className="px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPriceDraft({ min: '', max: '' });
                          setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }));
                          setPage(0);
                          setPriceOpen(false);
                        }}
                        className="px-2.5 py-1 text-gray-500 hover:text-gray-800 font-medium"
                      >
                        Xóa
                      </button>
                      <button
                        type="button"
                        onClick={applyPrice}
                        className="px-3 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-semibold"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced((s) => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-600/30 bg-emerald-50/60 text-emerald-800 font-semibold hover:bg-emerald-100 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Bộ lọc nâng cao</span>
              {advancedActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>}
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-gray-500 hover:text-gray-800 transition font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

<<<<<<< HEAD
          <div className="flex flex-wrap items-center gap-2 text-gray-500">
            {authChecked &&
              (user ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800 font-semibold">
                  {user.username} · {normalizeRole(user).toUpperCase()}
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Đăng xuất"
                    aria-label="Đăng xuất"
                    className="text-emerald-700 hover:text-emerald-950"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-800 font-semibold hover:bg-amber-100"
                >
                  <LogIn className="w-3 h-3" /> Đăng nhập để chỉnh sửa
                </button>
              ))}
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-sm transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Thêm sản phẩm
            </button>
=======
          <div className="flex items-center gap-2 text-gray-500">
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
            <span className="text-[11px]">
              Đã chọn: <strong className="text-gray-900">{selectedIds.size} SP</strong>
            </span>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              title="Tải lại dữ liệu"
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bộ lọc nâng cao */}
        {showAdvanced && (
          <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-gray-100">
            <label className="space-y-1">
              <span className="block text-[11px] font-semibold text-gray-500">Size</span>
              <FilterSelect value={filters.shirtSize} onChange={(v) => updateFilter('shirtSize', v)} active={Boolean(filters.shirtSize)}>
                <option value="">Tất cả size</option>
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </FilterSelect>
            </label>

            <label className="space-y-1">
              <span className="block text-[11px] font-semibold text-gray-500">Màu sắc</span>
              <input
                type="text"
                value={filters.color}
                onChange={(e) => updateFilter('color', e.target.value)}
                placeholder="VD: Đen, Trắng..."
                className="w-36 px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
              />
            </label>

            <label className="space-y-1">
              <span className="block text-[11px] font-semibold text-gray-500">Sắp xếp</span>
              <FilterSelect value={filters.sortBy} onChange={(v) => updateFilter('sortBy', v)} active={filters.sortBy !== 'newest'}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </FilterSelect>
            </label>

            <label className="flex items-center gap-2 pb-1.5 font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasSale}
                onChange={(e) => updateFilter('hasSale', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Đang khuyến mãi
            </label>

            <label className="flex items-center gap-2 pb-1.5 font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isHot}
                onChange={(e) => updateFilter('isHot', e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Sản phẩm hot
            </label>
          </div>
        )}

        {/* Các tag bộ lọc đang áp dụng */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-[11px]">
            <span className="text-gray-400 font-medium">Đang áp dụng:</span>
            {activeTags.map((t) => (
              <FilterTag key={t.key} label={t.label} value={t.value} onRemove={t.clear} />
            ))}
            <button type="button" onClick={resetFilters} className="text-emerald-700 hover:underline font-semibold ml-1">
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Thông báo lỗi */}
      {result.error && !loading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{getErrorMessage(result.error)}</span>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="px-3 py-1 rounded-md bg-white border border-rose-200 hover:bg-rose-100 font-semibold"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* =========================================================================
          3. BẢNG SẢN PHẨM & MA TRẬN BIẾN THỂ
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fcfdfd] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="w-10 py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="py-3 px-3 text-center w-16">HÌNH ẢNH</th>
                <th className="py-3 px-4">SẢN PHẨM & DANH MỤC</th>
                <th className="py-3 px-4">BIẾN THỂ (VARIANTS)</th>
                <th className="py-3 px-4">GIÁ NIÊM YẾT / BÁN</th>
                <th className="py-3 px-4">TỒN KHO KHẢ DỤNG</th>
                <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-center">THAO TÁC</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-gray-100 transition-opacity ${loading && data ? 'opacity-50' : ''}`}>
              {/* Trạng thái đang tải lần đầu */}
              {loading && !data && (
                <tr>
<<<<<<< HEAD
                  <td colSpan="8" className="py-16 text-center text-gray-400">
=======
                  <td colSpan="7" className="py-16 text-center text-gray-400">
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              )}

              {/* Không có dữ liệu */}
              {!loading && !result.error && products.length === 0 && (
                <tr>
<<<<<<< HEAD
                  <td colSpan="8" className="py-16 text-center text-gray-400">
=======
                  <td colSpan="7" className="py-16 text-center text-gray-400">
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
                    <Package className="w-6 h-6 mx-auto mb-2" />
                    Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}

              {products.map((p) => {
                const isExpanded = expandedId === p.id;
                return (
                  <Fragment key={p.id}>
                    {/* Hàng sản phẩm cha */}
                    <tr className={`hover:bg-gray-50/70 transition-colors ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(p.id)}
                            onChange={() => toggleSelect(p.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => toggleExpand(p.id)}
                            className="p-0.5 text-gray-400 hover:text-gray-700 transition"
                            aria-label="Xem biến thể"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Hình ảnh + badge số lượng SKU */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="relative inline-block">
                          <ProductThumb src={p.image} alt={p.name} />
                          <span className="absolute -bottom-1 -right-1 bg-gray-900/90 text-white text-[9px] font-bold px-1 rounded">
                            {p.skusCount}
                          </span>
                        </div>
                      </td>

                      {/* Thông tin sản phẩm & danh mục */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleExpand(p.id)}
                            className="font-bold text-gray-900 hover:text-emerald-700 text-left"
                          >
                            {p.name}
                          </button>
                          {p.hot && (
                            <span title="Sản phẩm hot">
                              <Flame className="w-3 h-3 text-orange-500" />
                            </span>
                          )}
                          <span title={`Slug: ${p.slug}`}>
                            <Info className="w-3 h-3 text-gray-400" />
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-400">
                          <span className="font-medium text-gray-500">MÃ SP: {p.code}</span>
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                            {p.category}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                            {p.brand}
                          </span>
                        </div>
                      </td>

                      {/* Biến thể tóm tắt */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-800">{p.variantsSummary}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{p.variantsDetail}</div>
                      </td>

                      {/* Giá */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                          {p.price}
                          {p.hasSale && p.discountPercent ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">
                              -{p.discountPercent}%
                            </span>
                          ) : null}
                        </div>
                        {p.originalPrice && (
                          <div className="text-[11px] text-gray-400 line-through mt-0.5">{p.originalPrice}</div>
                        )}
                      </td>

                      {/* Tồn kho */}
                      <td className="py-3.5 px-4">
                        <div
                          className={`font-bold ${
                            p.statusType === 'danger'
                              ? 'text-rose-600'
                              : p.statusType === 'warning'
                                ? 'text-amber-700'
                                : 'text-gray-900'
                          }`}
                        >
                          {p.stock}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{p.stockSub}</div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge type={p.statusType} label={p.status} />
<<<<<<< HEAD
                      </td>

                      {/* Thao tác: sửa / xóa */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            title="Sửa sản phẩm"
                            aria-label={`Sửa ${p.name}`}
                            className="p-1.5 rounded-md text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(p)}
                            title={user && !canDelete ? 'Chỉ ADMIN được xóa' : 'Xóa sản phẩm'}
                            aria-label={`Xóa ${p.name}`}
                            className={`p-1.5 rounded-md transition ${
                              user && !canDelete
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
=======
>>>>>>> 4cb118a60ec635bafe84b52100744de1469ea6e3
                      </td>
                    </tr>

                    {/* Ma trận biến thể con */}
                    {isExpanded && (
                      <tr className="bg-[#f8faf9] border-y border-emerald-100">
                        <td colSpan="8" className="p-4 pl-12 pr-6">
                          <div className="bg-white rounded-lg border border-emerald-200/80 shadow-2xs overflow-hidden">
                            <div className="p-2.5 px-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                                  Danh sách Biến thể (ProductVariants Matrix)
                                </span>
                                <span className="text-[10px] bg-emerald-100/80 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                                  {p.variants.length} cấu hình
                                </span>
                              </div>
                            </div>

                            {p.variants.length === 0 ? (
                              <div className="py-6 text-center text-gray-400 text-[11px]">
                                Sản phẩm này chưa có biến thể (size / màu).
                              </div>
                            ) : (
                              <table className="w-full text-left text-[11px]">
                                <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                                  <tr>
                                    <th className="py-2.5 px-3 text-center w-8">#</th>
                                    <th className="py-2.5 px-3">MÃ SKU</th>
                                    <th className="py-2.5 px-3">Màu sắc</th>
                                    <th className="py-2.5 px-3">Size</th>
                                    <th className="py-2.5 px-3">Giá vốn (Cost)</th>
                                    <th className="py-2.5 px-3">Giá bán</th>
                                    <th className="py-2.5 px-3">Tồn kho / Cảnh báo</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {p.variants.map((v) => (
                                    <tr key={v.id ?? v.no} className="hover:bg-gray-50/80 transition">
                                      <td className="py-2.5 px-3 text-center text-gray-400 font-medium">{v.no}</td>
                                      <td className="py-2.5 px-3 font-bold text-gray-800">{v.sku}</td>
                                      <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className="w-3 h-3 rounded-full border border-gray-300 shadow-2xs"
                                            style={{ backgroundColor: v.colorHex }}
                                          ></span>
                                          <span className="font-medium text-gray-700">{v.color}</span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-3 font-semibold text-gray-700">{v.size}</td>
                                      <td className="py-2.5 px-3 text-gray-500">{v.cost}</td>
                                      <td className="py-2.5 px-3 font-bold text-emerald-800">{v.price}</td>
                                      <td className="py-2.5 px-3">
                                        {v.warning ? (
                                          <span
                                            className={`font-bold flex items-center gap-1 ${
                                              v.stockQty <= 0 ? 'text-rose-600' : 'text-amber-700'
                                            }`}
                                          >
                                            <AlertTriangle
                                              className={`w-3 h-3 ${v.stockQty <= 0 ? 'text-rose-500' : 'text-amber-500'}`}
                                            />
                                            {v.warning}
                                          </span>
                                        ) : (
                                          <span className="text-gray-700 font-medium flex items-center gap-1">
                                            📦 {v.stock}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            4. PHÂN TRANG
            ========================================================================= */}
        <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            Hiển thị <strong className="text-gray-800">{from} – {to}</strong> trong tổng số{' '}
            <strong className="text-gray-800">{formatNumber(totalElements)}</strong> sản phẩm
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Số dòng:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 font-semibold focus:outline-none"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 font-semibold text-gray-600">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage(0)}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                |&lt;
              </button>
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={
                    n === page
                      ? 'px-2.5 py-1 rounded bg-emerald-700 text-white font-bold'
                      : 'px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition'
                  }
                >
                  {n + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(Math.max(0, totalPages - 1))}
                className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 transition text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &gt;|
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. BANNER ĐỒNG BỘ ĐA KÊNH (giữ nguyên từ thiết kế gốc – nội dung tĩnh)
          ========================================================================= */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black">
            ⇄
          </div>
          <div>
            <div className="font-bold text-emerald-900">Tự động đồng bộ đa kênh (Omnichannel Sync Active)</div>
            <div className="text-[11px] text-emerald-700/90 mt-0.5">
              Dữ liệu biến thể SKU và giá bán đang được đồng bộ tự động với TikTok Shop, Shopee Mall, Lazada và Hệ thống 42 Chi nhánh Offline mỗi 60 giây.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Webhook 20...</span>
        </div>
      </div>

      {/* =========================================================================
          6. MODAL THÊM / SỬA / XÓA / ĐĂNG NHẬP + THÔNG BÁO
          ========================================================================= */}
      {formOpen && (
        <ProductFormModal
          key={`${formOpen.mode}-${formOpen.product?.id ?? 'new'}`}
          mode={formOpen.mode}
          product={formOpen.product}
          brands={brands}
          categories={categories}
          auth={auth}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          product={deleteTarget}
          auth={auth}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />}

      {toast && (
        <div
          role="status"
          className={`fixed top-4 right-4 z-[70] max-w-sm flex items-start gap-2 px-3.5 py-2.5 rounded-lg shadow-lg border text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 mt-px shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-px shrink-0" />
          )}
          <span className="flex-1">{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Đóng thông báo">
            <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
          </button>
        </div>
      )}
    </div>
  );
}
