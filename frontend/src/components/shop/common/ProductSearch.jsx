import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowUpRight, Loader2, TrendingUp } from 'lucide-react';
import { resolveShopImageUrl } from '../../../features/shop/shared/utils/productUtils';
import ProductImage from './ProductImage';
import shopProductService from '../../../features/shop/products/services/shopProductService';
import { formatCurrency } from '../../../features/shop/shared/utils/formatters';
import { isAbortError } from '../../../features/shop/shared/utils/errorUtils';
import { shopPaths } from '../../../features/shop/shopPaths';

/**
 * Ô tìm kiếm sản phẩm có thể dùng ở Header hoặc trên trang danh sách.
 * - Gọi `onSubmit(keyword)` khi người dùng nhấn Enter / nút Tìm.
 * - Khi `enableSuggestions = true`, gọi `GET /api/products/suggestions?keyword&limit=5`
 *   (đã xác minh trong `ProductController`) để hiển thị từ khóa và sản phẩm gợi ý thực tế.
 */
export default function ProductSearch({
  defaultValue = '',
  onSubmit,
  placeholder = 'Tìm kiếm áo thun, polo, sơ mi...',
  enableSuggestions = true,
  className = '',
}) {
  // Lưu bản chỉnh sửa cục bộ kèm giá trị gốc để tự đồng bộ khi `defaultValue` từ URL đổi mà không cần setState trong useEffect
  const [draft, setDraft] = useState({ base: defaultValue, value: defaultValue });
  const keyword = draft.base === defaultValue ? draft.value : defaultValue;
  const setKeyword = (nextValue) => setDraft({ base: defaultValue, value: nextValue });

  const [open, setOpen] = useState(false);
  const [suggestionState, setSuggestionState] = useState({ key: null, data: null });
  const containerRef = useRef(null);

  const trimmedKeyword = keyword.trim();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gọi API gợi ý (debounce 250ms) khi dropdown mở
  useEffect(() => {
    if (!enableSuggestions || !open) return undefined;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      shopProductService
        .getSuggestions(trimmedKeyword, 5, controller.signal)
        .then((data) => {
          setSuggestionState({ key: trimmedKeyword, data });
        })
        .catch((err) => {
          if (!isAbortError(err)) {
            setSuggestionState({ key: trimmedKeyword, data: null });
          }
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedKeyword, open, enableSuggestions]);

  const triggerSubmit = (value) => {
    const clean = (value ?? keyword).trim();
    setOpen(false);
    onSubmit?.(clean);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    triggerSubmit(keyword);
  };

  const loading = enableSuggestions && open && suggestionState.key !== trimmedKeyword;
  const suggestions = suggestionState.data;
  const keywordList = suggestions?.keywordSuggestions || [];
  const productList = suggestions?.products || [];
  const hasAnySuggestion = keywordList.length > 0 || productList.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleFormSubmit} role="search" className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-zinc-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={keyword}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          aria-label="Tìm kiếm sản phẩm"
          className="h-10 w-full rounded-full border border-zinc-200 bg-zinc-50/80 pl-10 pr-20 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              triggerSubmit('');
            }}
            aria-label="Xóa từ khóa"
            className="absolute right-14 rounded-full p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1.5 h-7 rounded-full bg-zinc-900 px-3 text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          Tìm
        </button>
      </form>

      {enableSuggestions && open && (loading || hasAnySuggestion) && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
          {loading && !hasAnySuggestion ? (
            <div className="flex items-center justify-center gap-2 p-4 text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Đang tìm gợi ý...
            </div>
          ) : (
            <div className="max-h-[420px] divide-y divide-zinc-100 overflow-y-auto">
              {keywordList.length > 0 && (
                <div className="p-3">
                  <p className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    Từ khóa gợi ý
                  </p>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {keywordList.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => {
                          setKeyword(kw);
                          triggerSubmit(kw);
                        }}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-white"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {productList.length > 0 && (
                <div className="p-3">
                  <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Sản phẩm phù hợp
                  </p>
                  <ul className="space-y-1">
                    {productList.map((item) => {
                      const hasSale =
                        Number(item.salePrice) > 0 && Number(item.salePrice) < Number(item.price);
                      const displayPrice = hasSale ? item.salePrice : item.price;

                      return (
                        <li key={item.id ?? item.slug}>
                          <Link
                            to={
                              item.slug
                                ? shopPaths.productDetail(item.slug)
                                : shopPaths.products({ keyword: item.name })
                            }
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-zinc-50"
                          >
                            <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                              <ProductImage
                                src={resolveShopImageUrl(item.image)}
                                alt={item.name}
                                aspect="aspect-[3/4]"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-zinc-900">
                                {item.name}
                              </p>
                              <p className="truncate text-xs text-zinc-500">
                                {[item.brandName, item.categoryName].filter(Boolean).join(' • ')}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-xs font-bold text-rose-600">
                                {formatCurrency(displayPrice)}
                              </p>
                              {hasSale && (
                                <p className="text-[11px] text-zinc-400 line-through">
                                  {formatCurrency(item.price)}
                                </p>
                              )}
                            </div>
                            <ArrowUpRight
                              className="h-4 w-4 shrink-0 text-zinc-300"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
