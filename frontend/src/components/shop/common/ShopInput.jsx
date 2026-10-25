import { forwardRef, useId } from 'react';

/**
 * Ô nhập liệu dùng chung của Shop, hỗ trợ label, icon bên trái và thông báo lỗi.
 */
const ShopInput = forwardRef(function ShopInput(
  { label, error, hint, icon: Icon, className = '', inputClassName = '', id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={[
            'h-11 w-full rounded-xl border bg-white text-sm text-zinc-900 placeholder:text-zinc-400 transition',
            'focus:outline-none focus:ring-4',
            Icon ? 'pl-10 pr-3.5' : 'px-3.5',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-zinc-100',
            inputClassName,
          ].join(' ')}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default ShopInput;
