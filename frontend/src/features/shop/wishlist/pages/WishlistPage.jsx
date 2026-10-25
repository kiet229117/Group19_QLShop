import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, Star, LogIn } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ProductImage from '../../../../components/shop/common/ProductImage';
import ShopButton from '../../../../components/shop/common/ShopButton';
import useShopWishlist from '../hooks/useShopWishlist';
import { useShopState } from '../../shared/context/ShopStateContext';
import { useAuth } from '../../../auth/context/AuthContext';
import { shopPaths } from '../../shopPaths';
import { formatCurrency } from '../../shared/utils/formatters';
import { toast } from '../../../../components/common/Toast';

export default function WishlistPage() {
  const { items, count, removeItem } = useShopWishlist();
  const { addToCart } = useShopState();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    const res = addToCart(
      {
        id: item.productId || item.id,
        name: item.productName,
        slug: item.productSlug,
        price: item.productPrice,
        image: item.productImage,
      },
      { quantity: 1 }
    );
    if (res !== false) {
      toast.success(`Đã thêm "${item.productName}" vào giỏ hàng!`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductBreadcrumb
        items={[
          { label: 'Trang chủ', to: shopPaths.home() },
          { label: 'Sản phẩm yêu thích' },
        ]}
      />

      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
            Danh sách yêu thích
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Lưu giữ những bộ trang phục bạn yêu thích nhất ({count} sản phẩm)
          </p>
        </div>
        <Link
          to={shopPaths.products()}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
        >
          Khám phá thêm sản phẩm
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {!isAuthenticated ? (
        <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/60 p-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-zinc-900">
            Vui lòng đăng nhập để xem danh sách yêu thích
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            Danh sách sản phẩm yêu thích được gắn với tài khoản của bạn. Khi đăng xuất, danh sách sẽ được bảo mật tự động.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login" state={{ from: { pathname: shopPaths.wishlist() } }}>
              <ShopButton variant="primary" className="inline-flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Đăng nhập ngay
              </ShopButton>
            </Link>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-zinc-900">
            Chưa có sản phẩm yêu thích nào
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            Bạn chưa lưu sản phẩm nào vào danh sách mong muốn. Hãy dạo quanh cửa hàng và thả tim các món đồ ưng ý nhé!
          </p>
          <div className="mt-6">
            <Link to={shopPaths.products()}>
              <ShopButton variant="primary">Khám phá sản phẩm ngay</ShopButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const productId = item.productId || item.id;
            const detailSlug = item.productSlug || `${productId}`;
            return (
              <div
                key={productId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs transition hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
                    <Link to={shopPaths.productDetail(detailSlug)}>
                      <ProductImage
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(productId)}
                      title="Xóa khỏi yêu thích"
                      aria-label="Xóa khỏi yêu thích"
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm backdrop-blur transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    {item.brandName && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        {item.brandName}
                      </span>
                    )}
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold text-zinc-900 hover:text-emerald-700">
                      <Link to={shopPaths.productDetail(detailSlug)}>
                        {item.productName}
                      </Link>
                    </h3>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-black text-emerald-700">
                        {formatCurrency(item.productPrice)}
                      </span>
                      {item.productRating > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {Number(item.productRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 p-4 pt-3">
                  <ShopButton
                    variant="outline"
                    className="w-full text-xs font-bold"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag className="mr-1.5 h-4 w-4" />
                    Thêm vào giỏ
                  </ShopButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
