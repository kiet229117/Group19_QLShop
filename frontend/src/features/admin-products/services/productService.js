import api from '../../../services/api';

export const productService = {
  // 1. Lấy tất cả sản phẩm (phân trang)
  getAllProducts: async (page = 0, size = 10) => {
    const res = await api.get(`/products?page=${page}&size=${size}`);
    return res.data || res;
  },

  // 2. Lấy chi tiết sản phẩm theo slug
  getBySlug: async (slug) => {
    const res = await api.get(`/products/slug/${slug}`);
    return res.data || res;
  },

  // 3. Tìm kiếm sản phẩm theo từ khóa
  searchProducts: async (keyword, page = 0, size = 10) => {
    const res = await api.get(`/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return res.data || res;
  },

  // 4. Lọc theo danh mục
  filterByCategory: async (categoryId, page = 0, size = 10) => {
    const res = await api.get(`/products/filter/category?categoryId=${categoryId}&page=${page}&size=${size}`);
    return res.data || res;
  },

  // 5. Lọc theo thương hiệu
  filterByBrand: async (brandId, page = 0, size = 10) => {
    const res = await api.get(`/products/filter/brand?brandId=${brandId}&page=${page}&size=${size}`);
    return res.data || res;
  },

  // 6. Lọc nâng cao đa điều kiện
  filterAdvanced: async (filterParams) => {
    const res = await api.post('/products/filter', filterParams);
    return res.data || res;
  },

  // 7. Thêm sản phẩm mới (JSON)
  addProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data || res;
  },

  // 8. Cập nhật thông tin sản phẩm (PUT /api/products/{id})
  updateProduct: async (id, productData) => {
    // Nếu có file ảnh dùng FormData, nếu không gửi JSON
    if (productData instanceof FormData) {
      const res = await api.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data || res;
    }
    
    // Gửi JSON trực tiếp hoặc multipart form với Part "product"
    const res = await api.put(`/products/${id}`, productData);
    return res.data || res;
  },

  // 8b. Cập nhật nhanh tồn kho & giá vốn của 1 biến thể (PATCH /api/products/variants/{variantId}/stock)
  updateVariantStock: async (variantId, { stockQuantity, costPrice }) => {
    const res = await api.patch(`/products/variants/${variantId}/stock`, {
      stockQuantity,
      costPrice,
    });
    return res.data || res;
  },

  // 9. Xóa sản phẩm (DELETE /api/products/{id})
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data || res;
  },
};

export default productService;

