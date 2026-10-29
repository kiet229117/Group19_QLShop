import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Loader2,
  X,
  Navigation,
  Check,
  Map as MapIcon,
  ExternalLink,
  Crosshair,
  ChevronDown,
  ChevronUp,
  Truck,
} from 'lucide-react';
import {
  searchAddress,
  geocodeAddress,
  reverseGeocode,
  getMapEmbedUrl,
  getOpenStreetMapUrl,
  getGoogleMapsUrl,
  SHOP_ORIGIN_COORDINATES,
  calculateDistanceKm,
  calculateShippingFeeByDistance,
} from '../../../services/addressService';

/**
 * Ô nhập địa chỉ thông minh tích hợp gợi ý OpenStreetMap (Photon API),
 * nhúng bản đồ OpenStreetMap và tính khoảng cách/phí vận chuyển thực tế theo tọa độ.
 */
export default function AddressAutocompleteInput({
  label = 'Địa chỉ giao hàng (*)',
  name = 'shippingAddress',
  value = '',
  subtotal = 0,
  onChange,
  onBlur,
  onLocationChange,
  error = '',
  placeholder = 'Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành...',
  disabled = false,
  required = false,
  className = '',
  showMapDefault = true,
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Tọa độ thực tế phục vụ nhúng bản đồ và tính khoảng cách
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [showMap, setShowMap] = useState(showMapDefault);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isGeocodingRef = useRef(false);

  // Tính khoảng cách (km) và phí vận chuyển thực tế từ tọa độ Shop đến khách
  const distanceKm = coords
    ? calculateDistanceKm(
        SHOP_ORIGIN_COORDINATES.lat,
        SHOP_ORIGIN_COORDINATES.lon,
        coords.lat,
        coords.lon
      )
    : null;

  const shippingInfo = calculateShippingFeeByDistance(distanceKm, subtotal);

  // Thông báo tọa độ và phí ship ra component cha khi coords thay đổi
  useEffect(() => {
    if (coords && onLocationChange) {
      onLocationChange({
        address: inputValue,
        coords,
        distanceKm,
        shippingInfo,
      });
    }
  }, [coords?.lat, coords?.lon, distanceKm, subtotal]);

  // Đồng bộ giá trị từ component cha truyền vào
  useEffect(() => {
    setInputValue(value || '');

    // Nếu có giá trị nhưng chưa có tọa độ, tự động geocode để hiển thị bản đồ & tính phí
    if (value && value.trim().length >= 4 && !coords && !isGeocodingRef.current) {
      isGeocodingRef.current = true;
      geocodeAddress(value)
        .then((geo) => {
          if (geo && typeof geo.lat === 'number' && typeof geo.lon === 'number') {
            setCoords({ lat: geo.lat, lon: geo.lon });
          }
        })
        .finally(() => {
          isGeocodingRef.current = false;
        });
    }
  }, [value]);

  // Click outside listener để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dọn dẹp timer khi component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Gửi sự kiện thay đổi ra ngoài
  const notifyChange = (newVal) => {
    if (onChange) {
      onChange({ target: { name, value: newVal } });
    }
  };

  // Debounce tìm kiếm địa chỉ qua Photon API (300ms)
  const triggerSearch = useCallback((query) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const clean = (query || '').trim();
    if (clean.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const results = await searchAddress(clean, 6, controller.signal);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setHighlightedIndex(-1);
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.warn('[AddressAutocomplete] Lỗi tìm kiếm:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Xử lý khi người dùng gõ phím
  const handleInputChange = (e) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    notifyChange(nextVal);
    triggerSearch(nextVal);
  };

  // Xử lý khi chọn một mục trong danh sách gợi ý
  const handleSelectSuggestion = (suggestion) => {
    const selectedAddress = suggestion.fullAddress || suggestion.title;
    setInputValue(selectedAddress);
    setIsOpen(false);
    setSuggestions([]);

    if (typeof suggestion.lat === 'number' && typeof suggestion.lon === 'number') {
      setCoords({ lat: suggestion.lat, lon: suggestion.lon });
      setShowMap(true);
    }

    notifyChange(selectedAddress);
    if (onBlur) {
      onBlur();
    }
  };

  // Xóa địa chỉ
  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
    setCoords(null);
    notifyChange('');
    inputRef.current?.focus();
  };

  // Lấy vị trí GPS hiện tại của thiết bị (Geolocation)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        setShowMap(true);

        try {
          const rev = await reverseGeocode(lat, lon);
          if (rev && rev.fullAddress) {
            setInputValue(rev.fullAddress);
            notifyChange(rev.fullAddress);
          } else {
            const fallbackStr = `Tọa độ GPS: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            setInputValue(fallbackStr);
            notifyChange(fallbackStr);
          }
        } catch {
          // Bỏ qua lỗi reverse geocode
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocationError('Bạn đã từ chối quyền truy cập vị trí trên trình duyệt.');
        } else {
          setLocationError('Không thể lấy tọa độ hiện tại. Vui lòng nhập địa chỉ thủ công.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Bắt phím điều hướng
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const mapEmbedUrl = coords ? getMapEmbedUrl(coords.lat, coords.lon) : null;

  return (
    <div ref={containerRef} className={`relative space-y-2 ${className}`}>
      {/* Tiêu đề & thanh chức năng */}
      {label && (
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <label
            htmlFor={`input-${name}`}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-600"
          >
            <span>{label}</span>
          </label>

          <div className="flex items-center gap-2">
            {/* Nút định vị GPS hiện tại */}
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={locating || disabled}
              className="flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-50"
              title="Lấy vị trí GPS của tôi để tự động điền địa chỉ và tính phí ship"
            >
              {locating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Crosshair className="h-3 w-3 text-emerald-600" />
              )}
              <span>{locating ? 'Đang định vị...' : 'Vị trí hiện tại'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Ô nhập input chính */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </div>

        <input
          ref={inputRef}
          id={`input-${name}`}
          name={name}
          type="text"
          value={inputValue}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            } else if (inputValue && inputValue.trim().length >= 2) {
              triggerSearch(inputValue);
            }
          }}
          onBlur={() => {
            setTimeout(() => onBlur?.(), 200);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={`h-11 w-full rounded-xl border bg-white pl-10 pr-16 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-4 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-zinc-100'
          }`}
        />

        {/* Các nút hành động bên phải ô input */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" aria-label="Đang tìm kiếm..." />
          )}

          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
              title="Xóa địa chỉ"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Lỗi định vị hoặc validate */}
      {locationError && <p className="text-xs text-amber-700">{locationError}</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      {/* Dropdown danh sách gợi ý địa chỉ từ OpenStreetMap */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[68px] z-50 max-h-72 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-900/10">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 flex items-center justify-between">
            <span>
              {loading ? 'Đang tìm kiếm trên bản đồ...' : `Kết quả tìm kiếm (${suggestions.length})`}
            </span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Navigation className="h-2.5 w-2.5" /> Gợi ý địa chỉ
            </span>
          </div>

          {suggestions.length === 0 && !loading ? (
            <div className="py-4 text-center text-xs text-zinc-500">
              Không tìm thấy địa chỉ khớp. Hãy thử nhập tên đường, quận hoặc thành phố.
            </div>
          ) : (
            <ul className="divide-y divide-zinc-50 pt-1">
              {suggestions.map((item, idx) => {
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(item);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                        isHighlighted
                          ? 'bg-emerald-50 text-emerald-950'
                          : 'hover:bg-zinc-50 text-zinc-800'
                      }`}
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold leading-snug line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {item.fullAddress}
                        </p>
                      </div>
                      {isHighlighted && (
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-1" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-zinc-100 px-3 py-1.5 text-[10px] text-zinc-400 italic">
            * Chọn một mục để tự động ghim vị trí trên bản đồ và tính phí ship theo khoảng cách.
          </div>
        </div>
      )}

      {/* KHU VỰC NHÚNG BẢN ĐỒ OPENSTREETMAP & TÍNH PHÍ VẬN CHUYỂN */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/70 transition">
        {/* Thanh công cụ bản đồ */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 bg-white px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <MapIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold text-zinc-900">Bản đồ vị trí giao hàng</span>
            {coords && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Đã ghim vị trí
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {coords && (
              <a
                href={getOpenStreetMapUrl(coords.lat, coords.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-emerald-700 transition"
                title="Mở bản đồ toàn màn hình"
              >
                <span>Xem bản đồ lớn</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowMap((prev) => !prev)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-600 hover:bg-zinc-100 transition"
            >
              <span>{showMap ? 'Thu gọn' : 'Xem bản đồ'}</span>
              {showMap ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Thông tin Phí vận chuyển tính theo khoảng cách thực tế */}
        {distanceKm != null && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-medium">
              <Truck className="h-4 w-4 text-emerald-700" />
              <span>
                Khoảng cách đến Kho QLShop (Quận 1):{' '}
                <strong className="font-extrabold text-emerald-950">{distanceKm} km</strong>
              </span>
              <span className="text-emerald-700/80 text-[11px]">({shippingInfo.tier})</span>
            </div>
            <div className="font-bold text-emerald-900">
              Phí ship:{' '}
              <span className="text-sm font-extrabold text-emerald-700">
                {shippingInfo.fee === 0 ? 'Miễn phí' : `${shippingInfo.fee.toLocaleString('vi-VN')} đ`}
              </span>
            </div>
          </div>
        )}

        {/* Nội dung khung bản đồ nhúng */}
        {showMap && (
          <div className="relative">
            {coords ? (
              <div className="relative">
                <iframe
                  title="Bản đồ giao hàng"
                  src={mapEmbedUrl}
                  className="h-56 w-full border-0 bg-zinc-100"
                  loading="lazy"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/60 bg-white/95 px-3 py-1.5 text-[11px] text-zinc-600 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    <span className="font-semibold text-zinc-800">
                      Tọa độ: {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Hệ thống định vị giao hàng QLShop
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                <MapPin className="h-7 w-7 text-zinc-300 mb-1.5" />
                <p className="text-xs font-semibold text-zinc-700">
                  Chưa ghim vị trí trên bản đồ
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-400 max-w-sm">
                  Hãy nhập địa chỉ phía trên hoặc bấm nút{' '}
                  <span className="font-bold text-emerald-700">"Vị trí hiện tại"</span> để hiển thị
                  bản đồ giao hàng và tính cước vận chuyển tự động.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
