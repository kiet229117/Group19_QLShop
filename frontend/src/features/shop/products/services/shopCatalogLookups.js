import { toIdMap } from '../../shared/utils/productUtils';

// Fallback map rỗng ban đầu, các component Client hiện tại sử dụng useShopCategories & useShopBrands
export const SHOP_Categories_Map = toIdMap([]);
export const SHOP_Brands_Map = toIdMap([]);

export default {
  SHOP_Categories_Map,
  SHOP_Brands_Map,
};
