import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';

/**
 * Dải thương hiệu thực tế từ API trên Trang chủ.
 */
export default function BrandStrip({ brands = [], loading = false }) {
  if (!loading && brands.length === 0) return null;

  return (
    <section aria-labelledby="home-brands-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Đối tác & Thương hiệu
          </p>
          <h2 id="home-brands-heading" className="mt-1 text-2xl font-black tracking-tight text-zinc-900">
            Thương hiệu đồng hành
          </h2>
        </div>
        <Link
          to={shopPaths.brands()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 transition hover:text-emerald-600"
        >
          Tất cả thương hiệu
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.slice(0, 6).map((brand) => {
            const logo = resolveShopImageUrl(brand.logo);
            return (
              <Link
                key={brand.id}
                to={shopPaths.brandDetail(brand.slug || brand.id)}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={brand.name}
                    loading="lazy"
                    className="h-10 max-w-[120px] object-contain transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
                <span className="truncate text-xs font-bold text-zinc-800 group-hover:text-emerald-700">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
