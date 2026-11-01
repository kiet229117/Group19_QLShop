/**
 * Tiện ích Hướng dẫn chọn size nằm chung trong trường `description` của sản phẩm.
 * Admin chèn mẫu bằng nút "Chèn mẫu bảng size"; trang chi tiết sẽ tách phần này ra để hiển thị riêng.
 */
export const SIZE_GUIDE_MARKER = '📏 HƯỚNG DẪN CHỌN SIZE';

export const SIZE_GUIDE_TEMPLATE = `${SIZE_GUIDE_MARKER}:
• Size M: 1m60 - 1m70 | 55kg - 64kg
• Size L: 1m68 - 1m76 | 65kg - 74kg
• Size XL: 1m74 - 1m82 | 75kg - 84kg
(Lưu ý: Nếu thích mặc form rộng thoải mái, bạn có thể tăng lên 1 size nhé!)`;

/** Nối mẫu bảng size vào cuối mô tả hiện có (không ghi đè nội dung cũ, không chèn trùng). */
export function appendSizeGuide(description) {
  const current = description || '';
  if (current.includes(SIZE_GUIDE_MARKER)) return current;
  return current.trim() ? `${current.replace(/\s+$/, '')}\n\n${SIZE_GUIDE_TEMPLATE}` : SIZE_GUIDE_TEMPLATE;
}

/**
 * Tách mô tả thành { intro, guideTitle, rows, notes }.
 * `rows`: [{ size, detail }], `notes`: các dòng còn lại của khối hướng dẫn.
 */
export function parseSizeGuide(description) {
  const text = description || '';
  const idx = text.indexOf(SIZE_GUIDE_MARKER);
  if (idx === -1) return { intro: text, hasGuide: false, rows: [], notes: [] };

  const intro = text.slice(0, idx).trim();
  const lines = text
    .slice(idx)
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows = [];
  const notes = [];
  lines.forEach((line) => {
    const m = line.match(/^[•\-*]\s*(?:Size\s+)?([^:]+):\s*(.+)$/i);
    if (m) rows.push({ size: m[1].trim(), detail: m[2].trim() });
    else notes.push(line);
  });
  return { intro, hasGuide: true, rows, notes };
}
