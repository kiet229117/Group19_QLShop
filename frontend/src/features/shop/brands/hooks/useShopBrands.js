import { useMemo } from 'react';
import useShopQuery from '../../shared/hooks/useShopQuery';
import { toIdMap } from '../../shared/utils/productUtils';
import shopBrandService from '../services/shopBrandService';

/** Danh sách thương hiệu + Map tra cứu theo id. */
export default function useShopBrands() {
  const query = useShopQuery((signal) => shopBrandService.getAll(signal), 'shop-brands');
  const brands = useMemo(() => query.data || [], [query.data]);
  const brandMap = useMemo(() => toIdMap(brands), [brands]);

  return { ...query, brands, brandMap };
}
