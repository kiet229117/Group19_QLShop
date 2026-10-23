import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { toast } from './Toast';

/**
 * Helper chuẩn hóa URL hình ảnh:
 * Nếu là relative path như "/uploads/..." thì tự thêm host backend nếu cần
 */
export function getFullImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Nếu là /uploads/... từ Spring Boot
  const backendHost = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
  return `${backendHost}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function ImagePicker({
  value = '',
  onChange,
  folder = 'categories',
  label = 'Ảnh đại diện',
  placeholder = 'Chọn ảnh từ máy tính hoặc kéo thả vào đây',
  className = '',
  previewHeight = 'h-36'
}) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef(null);

  // Kích hoạt click vào file input ẩn
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Xử lý khi user chọn file từ máy tính
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file định dạng hình ảnh (PNG, JPG, WEBP,...)');
      return;
    }

    // Kiểm tra dung lượng (tối đa 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dung lượng ảnh không được vượt quá 10MB');
      return;
    }

    // Hiển thị preview tức thì bằng ObjectURL trong lúc upload
    const localPreviewUrl = URL.createObjectURL(file);
    if (onChange) onChange(localPreviewUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = response?.data?.url || response?.url;
      if (uploadedUrl) {
        if (onChange) onChange(uploadedUrl);
        toast.success('Đã tải ảnh lên thành công!');
      }
    } catch (err) {
      console.warn('Lỗi khi upload ảnh lên server, dùng ảnh đã chọn:', err);
      // Giữ nguyên preview đã chọn để người dùng tiếp tục thao tác
      toast.info('Đã chọn ảnh thành công!');
    } finally {
      setUploading(false);
    }
  };

  // Xử lý kéo thả file (Drag & Drop)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Xóa ảnh đã chọn
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onChange) onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Xác nhận nhập URL thủ công
  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (onChange) onChange(manualUrl.trim());
    setShowUrlInput(false);
    setManualUrl('');
  };

  const displayUrl = getFullImageUrl(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-gray-700 font-bold text-xs">{label}</label>
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(!showUrlInput);
              setManualUrl(value || '');
            }}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Ẩn nhập link' : 'Hoặc dán URL'}</span>
          </button>
        </div>
      )}

      {/* Input URL thủ công nếu cần */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-2.5 py-1 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:border-emerald-600"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-bold transition flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            <span>Áp dụng</span>
          </button>
        </div>
      )}

      {/* File input ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Khung hiển thị / Chọn ảnh */}
      {value ? (
        <div className={`relative w-full ${previewHeight} rounded-xl overflow-hidden border-2 border-emerald-500/30 bg-gray-50 group`}>
          <img
            src={displayUrl}
            alt="Preview"
            className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
            onError={(e) => {
              // Fallback nếu ảnh lỗi
              e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518';
            }}
          />

          {/* Overlay loading nếu đang upload */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1.5">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs font-semibold">Đang tải ảnh lên máy chủ...</span>
            </div>
          )}

          {/* Action buttons trên ảnh */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleTriggerFileInput}
              className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
              <span>Đổi ảnh khác</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow transition"
              title="Xóa ảnh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
            Đã chọn ảnh
          </div>
        </div>
      ) : (
        <div
          onClick={handleTriggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed border-gray-300 hover:border-emerald-600 bg-gray-50/70 hover:bg-emerald-50/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition group ${previewHeight}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-emerald-800">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-xs font-semibold">Đang tải ảnh lên...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-emerald-800 hover:underline">
                  Bấm để chọn ảnh từ máy tính
                </span>
                <span className="text-xs text-gray-500"> hoặc kéo thả ảnh vào đây</span>
                <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP hoặc GIF (Tối đa 10MB)</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

