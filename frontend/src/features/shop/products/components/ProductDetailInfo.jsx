import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';
import { CheckCircle2, Eye, Flame, Layers, ShoppingCart, ShoppingBag, Tag, XCircle, MessageSquare, MessageCircle, Heart, AlertTriangle } from 'lucide-react';
import ProductPrice from '../../../../components/shop/common/ProductPrice';
import ProductRating from '../../../../components/shop/common/ProductRating';
import ProductQuantitySelector from '../../../../components/shop/common/ProductQuantitySelector';
import AddToCartButton from '../../../../components/shop/common/AddToCartButton';
import ShopButton from '../../../../components/shop/common/ShopButton';
import useShopWishlist from '../../wishlist/hooks/useShopWishlist';
import { formatNumber } from '../../shared/utils/formatters';
import {
  getTotalStock,
  getUniqueVariantValues,
} from '../../shared/utils/productUtils';
import { useShopState } from '../../shared/context/ShopStateContext';
import { shopPaths } from '../../shopPaths';
import shopProductService from '../services/shopProductService';

/**
 * Thông tin chi tiết của sản phẩm và bộ chọn biến thể (Size / Màu / Số lượng)
 * kết hợp nút Thêm vào giỏ hàng & Mua ngay (cập nhật state cục bộ, không gọi API).
 */
export default function ProductDetailInfo({ product, category, brand }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useShopState();
  const { isWishlisted, toggleWishlist } = useShopWishlist();
  const isFav = isWishlisted(product?.id);

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const sizes = getUniqueVariantValues(variants, 'size');
  const colors = getUniqueVariantValues(variants, 'color');

  // Ưu tiên chọn sẵn biến thể (Size + Màu) đang CÒN HÀNG (> 0) làm mặc định để khách không bị rơi vào phân loại đã hết
  const firstInStockVariant = variants.find((v) => (Number(v.stockQuantity) || 0) > 0) || variants[0];

  const [selectedSize, setSelectedSize] = useState(firstInStockVariant?.size || sizes[0] || 'L');
  const [selectedColor, setSelectedColor] = useState(firstInStockVariant?.color || colors[0] || 'Đen');
  const [quantity, setQuantity] = useState(1);

  const matchedVariant = variants.find((v) => {
    const sizeMatch = !selectedSize || v.size === selectedSize;
    const colorMatch = !selectedColor || v.color === selectedColor;
    return sizeMatch && colorMatch;
  });

  const totalStock = getTotalStock(product);
  const activeStock = matchedVariant ? Number(matchedVariant.stockQuantity) || 0 : totalStock;
  const isHot = Boolean(product?.hot ?? product?.isHot);
  const outOfStock = activeStock !== null && activeStock <= 0;

  const rawSold = product?.soldQuantity ?? product?.sold_quantity ?? product?.soldCount;
  const initialSold = rawSold != null ? Number(rawSold) : null;
  const [soldCount, setSoldCount] = useState(initialSold != null && Number.isFinite(initialSold) ? initialSold : 0);

  useEffect(() => {
    const currentRaw = product?.soldQuantity ?? product?.sold_quantity ?? product?.soldCount;
    if (currentRaw != null && Number.isFinite(Number(currentRaw))) {
      setSoldCount(Number(currentRaw));
    } else if (product?.id) {
      let active = true;
      shopProductService
        .getProductSoldQuantity(product.id)
        .then((res) => {
          if (active && res?.soldQuantity != null) {
            setSoldCount(Number(res.soldQuantity) || 0);
          }
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }
  }, [product?.id, product?.soldQuantity, product?.sold_quantity, product?.soldCount]);

  const handleBuyNow = () => {
    if (outOfStock) {
      const variantDesc = [selectedColor, selectedSize].filter(Boolean).join(' - ');
      const desc = variantDesc ? ` (${variantDesc})` : '';
      toast.error(`Sản phẩm "${product.name}"${desc} hiện đã hết hàng, không thể mua ngay!`);
      return;
    }
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập tài khoản để tiến hành mua hàng!');
      navigate('/login', { state: { from: location } });
      return;
    }
    const addedId = addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    if (addedId) {
      navigate(shopPaths.cart());
    }
  };

  return (
    <div className="space-y-6">
      {/* Thương hiệu / Danh mục / Lượt xem */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {brand && (
          <Link
            to={shopPaths.brandDetail(brand.slug || brand.id)}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1 text-white transition hover:bg-emerald-600"
          >
            <Tag className="h-3 w-3" aria-hidden="true" />
            {brand.name}
          </Link>
        )}
        {category && (
          <Link
            to={shopPaths.categoryDetail(category.slug || category.id)}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 transition hover:bg-zinc-200"
          >
            <Layers className="h-3 w-3" aria-hidden="true" />
            {category.name}
          </Link>
        )}
        {isHot && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
            <Flame className="h-3 w-3" aria-hidden="true" />
            Sản phẩm Hot
          </span>
        )}
      </div>

      {/* Tên sản phẩm */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
         
          <ProductRating value={product.rating} size="lg" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100/80">
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>Đã bán: <strong className="font-bold text-emerald-800">{formatNumber(soldCount)}</strong></span>
          </span>
         
          <a
            href="#comments-section"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Xem &amp; viết bình luận</span>
          </a>
          {Number(product.views) > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              {formatNumber(product.views)} lượt xem
            </span>
          )}
        </div>
      </div>

      {/* Giá bán & khuyến mãi */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-5 sm:p-6 shadow-xs">
        <ProductPrice product={product} size="lg" showBadge />
      </div>

      {/* Chọn kích cỡ */}
      {sizes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <span>Kích cỡ</span>
            {selectedSize && <span className="text-zinc-900">Đang chọn: {selectedSize}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 rounded-xl border px-4 py-2 text-sm font-bold transition ${
                    active
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-900'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chọn màu sắc */}
      {colors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <span>Màu sắc</span>
            {selectedColor && <span className="text-zinc-900">Đang chọn: {selectedColor}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-900'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chọn số lượng & Tình trạng kho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Số lượng
          </span>
          <ProductQuantitySelector
            value={quantity}
            min={1}
            max={activeStock || 20}
            disabled={outOfStock}
            onChange={setQuantity}
          />
        </div>

        {activeStock !== null && (
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4.5 py-3 text-sm shadow-xs">
            {activeStock > 0 ? (
              activeStock < 10 ? (
                <>
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  <span className="text-zinc-700">
                    <strong className="font-bold text-amber-600">Sắp hết hàng:</strong> chỉ còn <strong className="font-bold text-zinc-900">{activeStock}</strong> sản phẩm{soldCount > 0 && <span className="text-zinc-500"> • Đã bán <strong className="font-semibold text-zinc-700">{formatNumber(soldCount)}</strong></span>}
                  </span>
                </>
              ) : (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span className="text-zinc-700">
                  Còn <strong className="font-bold text-zinc-900">{activeStock}</strong> sản phẩm{soldCount > 0 && <span className="text-zinc-500"> • Đã bán <strong className="font-semibold text-zinc-700">{formatNumber(soldCount)}</strong></span>}
                </span>
              </>
              )
            ) : (
              <>
                <XCircle className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                <span className="font-medium text-rose-600">
                  {totalStock > 0
                    ? `Phân loại (${selectedColor} - ${selectedSize}) tạm hết • Còn ${totalStock} chiếc ở Size/Màu khác`
                    : 'Hết hàng'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Nút Thêm vào giỏ & Mua ngay */}
      <div className="grid gap-3 pt-2 sm:grid-cols-2">
        <AddToCartButton
          product={product}
          size={selectedSize}
          color={selectedColor}
          quantity={quantity}
          disabled={outOfStock}
          buttonSize="lg"
          fullWidth
        />

        <ShopButton
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          className={
            outOfStock
              ? 'opacity-60 cursor-not-allowed bg-zinc-100 text-zinc-400 border-zinc-200 hover:border-zinc-200 hover:text-zinc-400'
              : ''
          }
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {outOfStock ? 'Tạm hết hàng' : 'Mua ngay'}
        </ShopButton>
      </div>

      {/* Nút Nhắn tin với chủ shop CSKH */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent('open-shop-chat', {
              detail: {
                product,
                initialMessage: `Dạ shop ơi, em muốn tư vấn thêm về mẫu áo "${product.name}" (${selectedColor} - ${selectedSize}) ạ!`,
              },
            })
          );
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50/80 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 hover:border-emerald-400 active:scale-98 shadow-xs"
      >
        <MessageCircle className="h-4 w-4 text-emerald-700" />
        <span>Nhắn tin với chủ shop CSKH tư vấn mẫu áo này</span>
      </button>

      {/* Mô tả sản phẩm */}
      <div className="space-y-2 border-t border-zinc-200 pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
          Mô tả sản phẩm
        </h2>
        {product.description ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">
            {product.description}
          </p>
        ) : (
          <p className="text-sm italic text-zinc-400">
            Sản phẩm chưa có mô tả chi tiết.
          </p>
        )}
      </div>
    </div>
  );
}
