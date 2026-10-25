import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { resolveShopImageUrl } from '../../shared/utils/productUtils';
import { shopPaths } from '../../shopPaths';

/**
 * Hiển thị danh mục sản phẩm thực tế từ API trên Trang chủ.
 */
export default function CategorySection({ categories = [], loading = false }) {
  if (!loading && categories.length === 0) return null;

  return (
    <section aria-labelledby="home-categories-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Danh mục sản phẩm
          </p>
          <h2 id="home-categories-heading" className="mt-1 text-2xl font-black tracking-tight text-zinc-900">
            Mua sắm theo dòng sản phẩm
          </h2>
        </div>
        <Link
          to={shopPaths.categories()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 transition hover:text-emerald-600"
        >
          Tất cả danh mục
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-zinc-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((cat) => {
            const img = resolveShopImageUrl(cat.image);
            return (
              <Link
                key={cat.id}
                to={shopPaths.categoryDetail(cat.slug || cat.id)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-lg"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                  {img ? (
                    <img
                      src={img}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <Layers className="h-6 w-6 text-zinc-400" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="truncate text-sm font-bold text-zinc-900 group-hover:text-emerald-700">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{cat.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
