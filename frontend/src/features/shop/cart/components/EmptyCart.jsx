import { ShoppingBag, ArrowRight } from 'lucide-react';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { shopPaths } from '../../shopPaths';

/**
 * Trạng thái giỏ hàng trống với minh họa trực quan, thông báo và nút quay lại mua sắm.
 */
export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center shadow-xs">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <ShoppingBag className="h-9 w-9" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-black tracking-tight text-zinc-900">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các mẫu áo thun, polo, sơ mi và khoác ngoài mới nhất tại QLShop.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ShopButton to={shopPaths.products()} variant="primary" size="lg">
          Khám phá sản phẩm ngay
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ShopButton>
        <ShopButton to={shopPaths.products({ hasSale: 'true' })} variant="outline" size="lg">
          Xem ưu đãi giảm giá
        </ShopButton>
      </div>
    </div>
  );
}
