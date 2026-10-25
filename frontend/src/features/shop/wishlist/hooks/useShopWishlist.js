import { useState, useEffect, useCallback } from 'react';
import shopWishlistService from '../services/shopWishlistService';
import { useAuth } from '../../../auth/context/AuthContext';
import { toast } from '../../../../components/common/Toast';

const STORAGE_KEY = 'qlshop_client_wishlist';

export function useShopWishlist() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const [items, setItems] = useState(() => {
    // Chỉ tải wishlist từ cache nếu người dùng đã đăng nhập
    try {
      const savedToken = localStorage.getItem('qlshop_token');
      if (!savedToken) return [];
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Xóa sạch danh sách yêu thích khi đăng xuất
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setItems([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [isAuthenticated, userId]);

  // Lắng nghe sự kiện đăng xuất toàn cục
  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Đồng bộ với backend khi user đăng nhập
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    let isMounted = true;
    const fetchApiWishlist = async () => {
      setLoading(true);
      try {
        const data = await shopWishlistService.getWishlist(userId);
        if (isMounted && Array.isArray(data)) {
          setItems(data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch (e) {
            console.warn(e);
          }
        }
      } catch (err) {
        console.warn('Không thể đồng bộ danh sách yêu thích:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApiWishlist();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userId]);

  // Cập nhật localStorage mỗi khi items thay đổi
  const saveItems = useCallback(
    (newItems) => {
      setItems(newItems);
      try {
        if (isAuthenticated) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [isAuthenticated]
  );

  const isWishlisted = useCallback(
    (productId) => {
      if (!productId || !isAuthenticated) return false;
      const targetId = Number(productId);
      return items.some((item) => Number(item.productId || item.id) === targetId);
    },
    [items, isAuthenticated]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product) return false;

      // Chưa đăng nhập -> chặn không cho thêm và thông báo
      if (!isAuthenticated) {
        toast.warning('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích!');
        return false;
      }

      const targetId = Number(product.id || product.productId);
      const currentlyWishlisted = items.some(
        (item) => Number(item.productId || item.id) === targetId
      );

      let nextItems;
      if (currentlyWishlisted) {
        nextItems = items.filter(
          (item) => Number(item.productId || item.id) !== targetId
        );
        toast.info('Đã bỏ sản phẩm khỏi danh sách yêu thích');
      } else {
        const newItem = {
          id: product.id,
          productId: targetId,
          productName: product.name || product.productName || 'Sản phẩm',
          productSlug: product.slug || product.productSlug || `${targetId}`,
          productPrice: product.price || product.productPrice || 0,
          productRating: product.rating || product.productRating || 5,
          productImage: product.image || product.productImage || product.images?.[0]?.imageUrl || '',
          brandName: product.brandName || product.brand?.name || '',
          categoryName: product.categoryName || product.category?.name || '',
        };
        nextItems = [newItem, ...items];
        toast.success('Đã lưu sản phẩm vào danh sách yêu thích!');
      }

      saveItems(nextItems);

      // Đồng bộ background qua API
      try {
        await shopWishlistService.toggleWishlist(targetId, userId);
      } catch (e) {
        console.warn('Lỗi đồng bộ toggle wishlist:', e);
      }

      return !currentlyWishlisted;
    },
    [items, userId, isAuthenticated, saveItems]
  );

  const removeItem = useCallback(
    async (productId) => {
      const targetId = Number(productId);
      const nextItems = items.filter(
        (item) => Number(item.productId || item.id) !== targetId
      );
      saveItems(nextItems);
      toast.info('Đã xóa sản phẩm khỏi danh sách yêu thích');
      try {
        await shopWishlistService.removeFromWishlist(targetId, userId);
      } catch (e) {
        console.warn('Lỗi xóa mục yêu thích:', e);
      }
    },
    [items, userId, saveItems]
  );

  return {
    items: isAuthenticated ? items : [],
    count: isAuthenticated ? items.length : 0,
    loading,
    isWishlisted,
    toggleWishlist,
    removeItem,
  };
}

export default useShopWishlist;
