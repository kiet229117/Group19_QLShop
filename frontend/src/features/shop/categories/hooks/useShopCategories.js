
import { useState, useEffect, useMemo } from 'react';
import { getAllActive } from '../services/shopCategoryService';
import { toIdMap } from '../../shared/utils/productUtils';

/** Danh sách danh mục đang kích hoạt + Map tra cứu theo id. */
export default function useShopCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAllActive();
        console.log("Cate: ", res);
        setCategories(Array.isArray(res) ? res : res.content || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories()
  },[]);

    const categoryMap = useMemo(() => toIdMap(categories), [categories]);
  return { categories, categoryMap, loading, error };
}
