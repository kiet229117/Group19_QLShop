import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { shopPaths } from '../../shopPaths';

/**
 * Hero / Banner trang chủ.
 * - Khi `banners` (từ GET /api/banners/active?position=HOME_SLIDER) có dữ liệu: hiển thị slider
 *   banner thực tế với `title`, `description`, `image`, `linkUrl`.
 * - Khi chưa có banner kích hoạt hoặc đang tải: hiển thị khối giới thiệu thương hiệu trung tính
 *   của QLShop (không bịa chương trình khuyến mãi hay số liệu).
 */
export default function HomeBanner({ banners = [], loading = false }) {
  const [index, setIndex] = useState(0);
  const count = banners.length;
  const safeIndex = count > 0 ? index % count : 0;

  useEffect(() => {
    if (count <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 6000);
    return () => clearInterval(timer);
  }, [count]);

  if (loading && count === 0) {
    return (
      <div className="h-[340px] w-full animate-pulse rounded-3xl bg-zinc-200/70 sm:h-[420px]" />
    );
  }

  // Fallback thương hiệu trung tính khi DB chưa có banner active
  if (count === 0) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950 px-6 py-16 text-white sm:px-12 sm:py-20">
        <div className="relative z-10 max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-white/15">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            QLShop Fashion Store
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Phong cách tối giản, chất liệu bền vững cho mỗi ngày.
          </h1>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
            Khám phá các thiết kế áo thun, polo, sơ mi và khoác ngoài được tuyển chọn từ các thương hiệu thời trang tại QLShop.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ShopButton to={shopPaths.products()} variant="accent" size="lg">
              Khám phá bộ sưu tập
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ShopButton>
            <ShopButton
              to={shopPaths.categories()}
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-white hover:border-white hover:bg-white hover:text-zinc-900"
            >
              Xem danh mục
            </ShopButton>
          </div>
        </div>
      </section>
    );
  }

  const current = banners[safeIndex];
  const imageUrl = resolveShopImageUrl(current?.image);
  const linkUrl = current?.linkUrl?.trim() || '';
  const isExternal = /^https?:\/\//i.test(linkUrl);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner nổi bật"
      className="group relative overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-lg"
    >
      <div className="relative min-h-[340px] sm:min-h-[440px]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={current?.title || 'Banner'}
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/45 to-transparent" />

        <div className="relative z-10 flex min-h-[340px] max-w-2xl flex-col justify-end p-6 sm:min-h-[440px] sm:justify-center sm:p-12">
          {current?.title && (
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {current.title}
            </h1>
          )}
          {current?.description && (
            <p className="mt-3 line-clamp-3 text-sm text-zinc-200 sm:text-base">
              {current.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {linkUrl ? (
              isExternal ? (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-zinc-900 transition hover:bg-emerald-500 hover:text-white"
                >
                  Xem ngay
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={linkUrl}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-zinc-900 transition hover:bg-emerald-500 hover:text-white"
                >
                  Xem ngay
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )
            ) : (
              <ShopButton to={shopPaths.products()} variant="accent">
                Mua sắm ngay
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ShopButton>
            )}
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((prev) => (prev - 1 + count) % count)}
            aria-label="Banner trước"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-zinc-900 opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((prev) => (prev + 1) % count)}
            aria-label="Banner tiếp theo"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-zinc-900 opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id ?? i}
                type="button"
                aria-label={`Chuyển tới banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === safeIndex ? 'w-7 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
