import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import ShopButton from './ShopButton';
import { useShopState } from '../../../features/shop/shared/context/ShopStateContext';

/**
 * Nút Thêm vào giỏ hàng dùng chung (chỉ cập nhật state cục bộ trên giao diện, không gọi API).
 */
export default function AddToCartButton({
  product,
  size = 'L',
  color = 'Đen',
  quantity = 1,
  disabled = false,
  variant = 'primary',
  buttonSize = 'md',
  fullWidth = false,
  label = 'Thêm vào giỏ hàng',
  onAdded,
  className = '',
}) {
  const { addToCart } = useShopState();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product || disabled) return;

    const selectedSize =
      size || product?.variants?.[0]?.size || 'L';
    const selectedColor =
      color || product?.variants?.[0]?.color || 'Đen';

    addToCart(product, { size: selectedSize, color: selectedColor, quantity });
    setJustAdded(true);
    onAdded?.();
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <ShopButton
      variant={justAdded ? 'accent' : variant}
      size={buttonSize}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={handleClick}
      className={className}
    >
      {justAdded ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Đã thêm vào giỏ (Mô phỏng)
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {label}
        </>
      )}
    </ShopButton>
  );
}
