import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Stack các modal đang mở: Esc chỉ đóng modal nằm trên cùng
const openLayers = [];

const SIZES = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

export default function ModalShell({
  title,
  subtitle,
  onClose,
  disableClose = false,
  closeOnBackdrop = true,
  size = 'md',
  layer = 50,
  children,
  footer,
}) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    openLayers.push(layer);
    const onKey = (e) => {
      if (e.key !== 'Escape' || disableClose) return;
      if (Math.max(...openLayers) !== layer) return;
      closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      const i = openLayers.lastIndexOf(layer);
      if (i >= 0) openLayers.splice(i, 1);
    };
  }, [layer, disableClose]);

  return (
    <div
      className="fixed inset-0 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-gray-900/45 backdrop-blur-[1px]"
      style={{ zIndex: layer }}
      onMouseDown={(e) => {
        if (closeOnBackdrop && !disableClose && e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white w-full ${SIZES[size] ?? SIZES.md} max-h-[92vh] flex flex-col rounded-xl shadow-2xl border border-gray-200 text-xs`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900">{title}</h2>
            {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => closeRef.current()}
            disabled={disableClose}
            aria-label="Đóng"
            className="p-1 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/70 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
}
