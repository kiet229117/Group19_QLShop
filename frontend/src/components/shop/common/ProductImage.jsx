import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Ảnh sản phẩm với khung tỉ lệ cố định và fallback trung tính khi không có ảnh / ảnh lỗi.
 * `src` phải là URL đầy đủ (dùng getProductImages / getFullImageUrl trước khi truyền vào).
 */
export default function ProductImage({
  src,
  alt = '',
  aspect = 'aspect-[3/4]',
  className = '',
  imgClassName = '',
  loading = 'lazy',
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showFallback = !src || failedSrc === src;

  return (
    <div className={`relative overflow-hidden bg-zinc-100 ${aspect} ${className}`}>
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400">
          <ImageOff className="h-8 w-8" aria-hidden="true" />
          <span className="text-xs">Chưa có hình ảnh</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailedSrc(src)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
