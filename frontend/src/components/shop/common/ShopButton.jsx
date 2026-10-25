import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black shadow-sm hover:shadow-md disabled:bg-zinc-300 disabled:shadow-none',
  accent:
    'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-sm hover:shadow-md disabled:bg-emerald-200 disabled:shadow-none',
  outline:
    'border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900 hover:text-zinc-900 disabled:text-zinc-400 disabled:border-zinc-200',
  ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 disabled:text-zinc-400',
  subtle: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 disabled:text-zinc-400',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10 justify-center',
};

/**
 * Nút bấm dùng chung của Shop.
 * - Truyền `to` để render thành <Link> điều hướng nội bộ.
 * - `loading` hiển thị spinner và vô hiệu hóa nút.
 */
export default function ShopButton({
  children,
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
