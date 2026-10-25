/**
 * Tiện ích chuẩn hóa dữ liệu phân trang trả về từ Spring Data `Page<T>`.
 *
 * Backend (Spring Boot 4 / Spring Data) có thể serialize `Page` theo 2 dạng:
 *  - DIRECT:  { content: [], number, size, totalElements, totalPages, first, last, ... }
 *  - VIA_DTO: { content: [], page: { number, size, totalElements, totalPages } }
 * Hàm dưới đây hỗ trợ cả hai dạng và KHÔNG tự suy diễn số trang khi thiếu metadata.
 */
export function normalizePage(data) {
  if (Array.isArray(data)) {
    // Endpoint trả về mảng thuần (không phân trang)
    return {
      items: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: data.length > 0 ? 1 : 0,
      hasMetadata: false,
    };
  }

  const items = Array.isArray(data?.content) ? data.content : [];
  const meta = data?.page && typeof data.page === 'object' ? data.page : data || {};

  const totalPages = Number.isFinite(meta.totalPages) ? meta.totalPages : null;
  const totalElements = Number.isFinite(meta.totalElements) ? meta.totalElements : null;

  return {
    items,
    page: Number.isFinite(meta.number) ? meta.number : 0,
    size: Number.isFinite(meta.size) ? meta.size : items.length,
    totalElements,
    totalPages,
    hasMetadata: totalPages !== null,
  };
}

/**
 * Lấy toàn bộ bản ghi của một endpoint phân trang bằng cách duyệt theo metadata thực tế.
 * Dùng cho các danh sách tham chiếu nhỏ (danh mục, thương hiệu) vốn không có endpoint "lấy tất cả".
 *
 * @param {(page: number, size: number, signal?: AbortSignal) => Promise<any>} fetchPage
 * @param {{ pageSize?: number, maxPages?: number, signal?: AbortSignal }} options
 */
export async function fetchAllPages(fetchPage, { pageSize = 100, maxPages = 20, signal } = {}) {
  const all = [];
  let page = 0;

  while (page < maxPages) {
    const raw = await fetchPage(page, pageSize, signal);
    const normalized = normalizePage(raw);
    all.push(...normalized.items);

    const isLastPage =
      !normalized.hasMetadata ||
      normalized.items.length === 0 ||
      page + 1 >= normalized.totalPages;

    if (isLastPage) break;
    page += 1;
  }

  return all;
}
