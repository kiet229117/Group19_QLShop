import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import ShopButton from './ShopButton';
import { useShopState } from '../../../features/shop/shared/context/ShopStateContext';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { toast } from '../../common/Toast';

/**
 * Nút Thêm vào giỏ hàng dùng chung (Yêu cầu đăng nhập tài khoản)
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product || disabled) return;

    // Chưa đăng nhập -> chặn và điều hướng đăng nhập
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login', { state: { from: location } });
      return;
    }

    const selectedSize =
      size || product?.variants?.[0]?.size || 'L';
    const selectedColor =
      color || product?.variants?.[0]?.color || 'Đen';

    const res = addToCart(product, { size: selectedSize, color: selectedColor, quantity });
    if (res !== false) {
      setJustAdded(true);
      onAdded?.();
      setTimeout(() => setJustAdded(false), 1600);
    }
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
          Đã thêm vào giỏ hàng
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
