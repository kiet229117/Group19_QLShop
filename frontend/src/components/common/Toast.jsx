import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

const ToastContext = createContext(null);

// Global listener & hàng đợi để đảm bảo gọi toast từ bất kỳ đâu (kể cả trước khi Provider kịp mount)
let globalToastHandler = null;
const toastQueue = [];

export const toast = {
  success: (message, title = 'Thành công') => {
    if (globalToastHandler) {
      globalToastHandler({ type: 'success', title, message });
    } else {
      toastQueue.push({ type: 'success', title, message });
    }
  },
  error: (message, title = 'Đã có lỗi xảy ra') => {
    const cleanMsg = getFriendlyErrorMessage(message, typeof message === 'string' ? message : 'Đã có lỗi xảy ra');
    if (globalToastHandler) {
      globalToastHandler({ type: 'error', title, message: cleanMsg });
    } else {
      toastQueue.push({ type: 'error', title, message: cleanMsg });
    }
  },
  warning: (message, title = 'Cảnh báo') => {
    if (globalToastHandler) {
      globalToastHandler({ type: 'warning', title, message });
    } else {
      toastQueue.push({ type: 'warning', title, message });
    }
  },
  info: (message, title = 'Thông báo') => {
    if (globalToastHandler) {
      globalToastHandler({ type: 'info', title, message });
    } else {
      toastQueue.push({ type: 'info', title, message });
    }
  },
  show: (options) => {
    const cleanOptions = { ...options };
    if (cleanOptions?.type === 'error' && cleanOptions.message) {
      cleanOptions.message = getFriendlyErrorMessage(cleanOptions.message, typeof cleanOptions.message === 'string' ? cleanOptions.message : 'Đã có lỗi xảy ra');
    }
    if (globalToastHandler) {
      globalToastHandler(cleanOptions);
    } else {
      toastQueue.push(cleanOptions);
    }
  },
};

// Gắn window.toast để developer hoặc người dùng có thể test trực tiếp bằng Console (F12)
if (typeof window !== 'undefined') {
  window.toast = toast;
}

// Cấu hình style & icon theo loại thông báo
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-200/90',
    bgColor: 'bg-white/95',
    progressBg: 'bg-emerald-500',
    accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    defaultTitle: 'Thành công',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-rose-500',
    borderColor: 'border-rose-200/90',
    bgColor: 'bg-white/95',
    progressBg: 'bg-rose-500',
    accentBg: 'bg-rose-50 text-rose-800 border-rose-200',
    defaultTitle: 'Đã có lỗi xảy ra',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200/90',
    bgColor: 'bg-white/95',
    progressBg: 'bg-amber-500',
    accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
    defaultTitle: 'Cảnh báo',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200/90',
    bgColor: 'bg-white/95',
    progressBg: 'bg-blue-500',
    accentBg: 'bg-blue-50 text-blue-800 border-blue-200',
    defaultTitle: 'Thông tin',
  },
};

// Component từng thẻ Toast đơn lẻ
function ToastItem({ toastItem, onRemove }) {
  const { id, type = 'info', title, message, duration = 3500 } = toastItem;
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const IconComponent = config.icon;

  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);

  const startDismissTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(id), 260);
    }, remainingTimeRef.current);
  }, [id, onRemove]);

  const pauseTimer = () => {
    setIsPaused(true);
    clearTimeout(timerRef.current);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    startDismissTimer();
  };

  const handleClose = () => {
    clearTimeout(timerRef.current);
    setIsExiting(true);
    setTimeout(() => onRemove(id), 260);
  };

  // Hiệu ứng thanh tiến trình (progress bar)
  useEffect(() => {
    if (isPaused) return;
    const interval = 30; // ms
    const step = (interval / duration) * 100;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [duration, isPaused]);

  useEffect(() => {
    startDismissTimer();
    return () => clearTimeout(timerRef.current);
  }, [startDismissTimer]);

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 select-none ${
        config.bgColor
      } ${config.borderColor} ${isExiting ? 'toast-slide-out' : 'toast-slide-in'}`}
      style={{
        boxShadow:
          type === 'success'
            ? '0 10px 25px -5px rgba(16, 185, 129, 0.15), 0 8px 10px -6px rgba(16, 185, 129, 0.1)'
            : type === 'error'
            ? '0 10px 25px -5px rgba(244, 63, 94, 0.15), 0 8px 10px -6px rgba(244, 63, 94, 0.1)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex items-start gap-3 p-3.5 pr-2">
        {/* Icon nhận diện */}
        <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${config.accentBg} flex items-center justify-center`}>
          <IconComponent className={`w-4 h-4 ${config.iconColor} stroke-[2.2]`} />
        </div>

        {/* Nội dung Toast */}
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs font-bold text-gray-900 tracking-tight leading-tight">
            {title || config.defaultTitle}
          </h4>
          {message && (
            <p className="text-[11px] text-gray-600 mt-0.5 font-medium leading-relaxed break-words">
              {message}
            </p>
          )}
        </div>

        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition active:scale-95"
          title="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Thanh thời gian (Progress bar) tự thu hẹp ở cạnh dưới */}
      <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressBg}`}
          style={{ width: `${Math.max(0, progress)}%` }}
        />
      </div>
    </div>
  );
}

// Toast Provider bao bọc toàn ứng dụng
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = { id, type, title, message, duration };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  // Đăng ký global handler & giải phóng hàng đợi toast nếu có
  useEffect(() => {
    globalToastHandler = showToast;
    if (toastQueue.length > 0) {
      while (toastQueue.length > 0) {
        const queuedItem = toastQueue.shift();
        showToast(queuedItem);
      }
    }
    return () => {
      globalToastHandler = null;
    };
  }, [showToast]);

  const success = useCallback((message, title = 'Thành công') => showToast({ type: 'success', title, message }), [showToast]);
  const error = useCallback((message, title = 'Đã có lỗi xảy ra') => showToast({ type: 'error', title, message }), [showToast]);
  const warning = useCallback((message, title = 'Cảnh báo') => showToast({ type: 'warning', title, message }), [showToast]);
  const info = useCallback((message, title = 'Thông báo') => showToast({ type: 'info', title, message }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, toast }}>
      {children}

      {/* Khung hiển thị Toast cố định ở góc trên bên phải màn hình */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-32px)] sm:w-96 pointer-events-none"
        style={{ zIndex: 999999 }}
      >
        {toasts.map((item) => (
          <ToastItem key={item.id} toastItem={item} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook tiện ích để gọi trong Component
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Nếu dùng ngoài provider thì fallback về global toast
    return {
      showToast: toast.show,
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      toast,
    };
  }
  return context;
}

export default ToastProvider;

