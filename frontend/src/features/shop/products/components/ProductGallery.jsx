import { useState } from 'react';
import ProductImage from '../../../../components/shop/common/ProductImage';
import { getProductImages } from '../../shared/utils/productUtils';

/**
 * Thư viện ảnh trang Chi tiết sản phẩm.
 * Hiển thị `primaryImage` và danh sách `images` thực tế từ `ProductReponse`.
 */
export default function ProductGallery({ product }) {
  const images = getProductImages(product);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeUrl = images[selectedIndex] || images[0] || '';

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white">
        <ProductImage
          src={activeUrl}
          alt={product?.name || 'Sản phẩm'}
          aspect="aspect-[3/4]"
          loading="eager"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
          {images.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={`overflow-hidden rounded-2xl border-2 transition ${
                idx === selectedIndex
                  ? 'border-zinc-900 ring-2 ring-zinc-900/20'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <ProductImage src={url} alt="" aspect="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
