import { SHOP_BRANDS } from '../../shared/data/shopMockData';

/**
 * Service thương hiệu cho Client Shop (thuần Frontend, dữ liệu mẫu tĩnh, không gọi API).
 */
export const shopBrandService = {
  async getPage(page = 0, size = 100) {
    const start = page * size;
    const content = SHOP_BRANDS.slice(start, start + size);
    return {
      content,
      number: page,
      size,
      totalElements: SHOP_BRANDS.length,
      totalPages: Math.max(1, Math.ceil(SHOP_BRANDS.length / size)),
    };
  },

  async getAll() {
    return [...SHOP_BRANDS];
  },
};

export default shopBrandService;
