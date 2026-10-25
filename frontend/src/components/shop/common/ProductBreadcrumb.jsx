import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { shopPaths } from '../../../features/shop/shopPaths';

/**
 * Breadcrumb điều hướng. `items`: [{ label, to? }] – phần tử cuối là trang hiện tại.
 * Luôn bắt đầu bằng "Trang chủ" của Shop.
 */
export default function ProductBreadcrumb({ items = [], className = '' }) {
  const all = [{ label: 'Trang chủ', to: shopPaths.home(), isHome: true }, ...items.filter(Boolean)];

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-zinc-500">
        {all.map((item, index) => {
          const isLast = index === all.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300" aria-hidden="true" />}
              {item.to && !isLast ? (
                <Link to={item.to} className="inline-flex items-center gap-1 transition hover:text-zinc-900">
                  {item.isHome && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  {item.label}
                </Link>
              ) : (
                <span className="truncate font-medium text-zinc-900" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
