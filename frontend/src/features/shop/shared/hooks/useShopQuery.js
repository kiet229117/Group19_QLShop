import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError } from '../utils/errorUtils';

/**
 * Hook truy vấn dữ liệu bất đồng bộ dùng chung cho Client Shop.
 *
 * - `queryFn(signal)` trả về Promise dữ liệu (đã bóc tách từ response).
 * - `key` là chuỗi định danh tham số truy vấn; đổi key sẽ gọi lại API và hủy request cũ.
 * - `loading` được suy ra từ việc kết quả hiện có có khớp key hay không (không setState đồng bộ trong effect).
 *
 * @returns {{ data: any, previousData: any, error: any, loading: boolean, refetch: () => void }}
 */
export default function useShopQuery(queryFn, key, { enabled = true } = {}) {
  const [result, setResult] = useState({ requestKey: null, data: undefined, error: null });
  const [reloadToken, setReloadToken] = useState(0);
  const queryFnRef = useRef(queryFn);

  const requestKey = `${key}::${reloadToken}`;

  useEffect(() => {
    queryFnRef.current = queryFn;
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    let active = true;

    Promise.resolve()
      .then(() => queryFnRef.current(controller.signal))
      .then(
        (data) => {
          if (active) setResult({ requestKey, data, error: null });
        },
        (error) => {
          if (!active || isAbortError(error)) return;
          setResult((prev) => ({ requestKey, data: undefined, error, lastData: prev.data }));
        }
      );

    return () => {
      active = false;
      controller.abort();
    };
  }, [requestKey, enabled]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  // Tự động làm mới dữ liệu khi có đơn hàng vừa đặt/hủy hoặc khi Admin cập nhật tồn kho sản phẩm
  useEffect(() => {
    if (!enabled) return undefined;
    const handleRefresh = () => setReloadToken((t) => t + 1);
    window.addEventListener('qlshop:products-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);
    return () => {
      window.removeEventListener('qlshop:products-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [enabled]);

  const isCurrent = result.requestKey === requestKey;

  return {
    data: isCurrent ? result.data : undefined,
    previousData: result.data ?? result.lastData,
    error: isCurrent ? result.error : null,
    loading: enabled && !isCurrent,
    refetch,
  };
}
