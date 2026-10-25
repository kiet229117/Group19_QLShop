import api from '../../../../services/api';

/**
 * Service kết nối trực tiếp với backend WishListController (/api/wishlists)
 */
export const shopWishlistService = {
  /**
   * Lấy danh sách sản phẩm yêu thích
   */
  async getWishlist(userId) {
    try {
      const res = await api.get('/wishlists', {
        params: userId ? { userId } : undefined,
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.warn('Lỗi khi tải danh sách yêu thích từ API:', err);
      return [];
    }
  },

  /**
   * Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
   */
  async toggleWishlist(productId, userId) {
    try {
      const res = await api.post('/wishlists/toggle', {
        productId: Number(productId),
        userId: userId ? Number(userId) : undefined,
      });
      return res.data;
    } catch (err) {
      console.warn('Lỗi khi toggle yêu thích qua API:', err);
      return null;
    }
  },

  /**
   * Kiểm tra một sản phẩm đã yêu thích hay chưa
   */
  async checkWishlist(productId, userId) {
    try {
      const res = await api.get(`/wishlists/check/${productId}`, {
        params: userId ? { userId } : undefined,
      });
      return !!res.data?.isWishlisted;
    } catch (err) {
      console.warn('Lỗi khi kiểm tra yêu thích:', err);
      return false;
    }
  },

  /**
   * Xóa sản phẩm khỏi danh sách yêu thích theo productId
   */
  async removeFromWishlist(productId, userId) {
    try {
      await api.delete(`/wishlists/product/${productId}`, {
        params: userId ? { userId } : undefined,
      });
      return true;
    } catch (err) {
      console.warn('Lỗi khi xóa khỏi yêu thích:', err);
      return false;
    }
  },
};

export default shopWishlistService;

