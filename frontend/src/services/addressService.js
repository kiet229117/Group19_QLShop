/**
 * Dịch vụ gợi ý, tìm kiếm địa chỉ và bản đồ thực tế qua Photon API & OpenStreetMap.
 * Sử dụng 100% dữ liệu thực từ OpenStreetMap, không dùng dữ liệu giả lập (mockup).
 */

/**
 * Định dạng đối tượng thuộc tính của Photon/OSM thành chuỗi địa chỉ Việt Nam hoàn chỉnh.
 */
export function formatPhotonAddress(props) {
  if (!props) return '';
  const parts = [];

  // Số nhà
  if (props.housenumber) {
    parts.push(props.housenumber);
  }

  // Tên đường hoặc địa danh / tòa nhà
  if (props.street) {
    if (props.name && props.name !== props.street && !parts.includes(props.name)) {
      parts.push(props.name);
    }
    parts.push(props.street);
  } else if (props.name) {
    parts.push(props.name);
  }

  // Phường / Xã / Khu phố (Locality)
  if (props.locality && !parts.includes(props.locality)) {
    parts.push(props.locality);
  }

  // Quận / Huyện / Thị xã (District)
  if (props.district && !parts.includes(props.district)) {
    parts.push(props.district);
  }

  // Huyện / Xã / Vùng (County)
  if (props.county && !parts.includes(props.county)) {
    parts.push(props.county);
  }

  // Tỉnh / Thành phố (City hoặc State)
  if (props.city && !parts.includes(props.city)) {
    parts.push(props.city);
  }
  if (props.state && !parts.includes(props.state) && props.state !== props.city) {
    parts.push(props.state);
  }

  // Quốc gia
  if (props.country && !parts.includes(props.country)) {
    parts.push(props.country);
  }

  return parts.filter(Boolean).join(', ');
}

/**
 * Tạo URL iframe embed OpenStreetMap có marker pin đỏ tại tọa độ thực
 * @param {number} lat Vĩ độ
 * @param {number} lon Kinh độ
 * @param {number} zoomOffset Độ phóng to khung nhìn
 */
export function getMapEmbedUrl(lat, lon, zoomOffset = 0.0035) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  const minLon = (lon - zoomOffset * 1.5).toFixed(6);
  const minLat = (lat - zoomOffset).toFixed(6);
  const maxLon = (lon + zoomOffset * 1.5).toFixed(6);
  const maxLat = (lat + zoomOffset).toFixed(6);
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat.toFixed(6)}%2C${lon.toFixed(6)}`;
}

/**
 * Tạo URL mở địa chỉ thực trên bản đồ OpenStreetMap
 */
export function getOpenStreetMapUrl(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
}

/**
 * Tạo URL mở địa chỉ thực trên Google Maps
 */
export function getGoogleMapsUrl(query, lat, lon) {
  if (typeof lat === 'number' && typeof lon === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return 'https://maps.google.com';
}

/**
 * Tìm kiếm danh sách địa chỉ gợi ý thực tế qua Photon API (OpenStreetMap)
 * @param {string} query Từ khóa tìm kiếm thực tế (VD: "268 Lý Thường Kiệt", "Quận 10", "Hà Nội")
 * @param {number} limit Số lượng kết quả tối đa
 * @param {AbortSignal} signal Hủy yêu cầu khi người dùng tiếp tục gõ
 */
export async function searchAddress(query, limit = 6, signal) {
  if (!query || typeof query !== 'string') return [];
  const clean = query.trim();
  if (clean.length < 2) return [];

  // Tọa độ trung tâm Việt Nam lat=16.0, lon=108.0 để ưu tiên kết quả tại Việt Nam
  // KHÔNG thêm &lang=vi vì Photon API chỉ hỗ trợ 'default, de, en, fr' (truyền 'vi' gây lỗi HTTP 400).
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=${limit}&lat=16.0&lon=108.0`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      console.warn(`[Photon OSM] HTTP ${res.status}: không lấy được dữ liệu.`);
      return [];
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.features)) return [];

    return data.features
      .map((f, idx) => {
        const p = f.properties || {};
        const coords = f.geometry?.coordinates || []; // [lon, lat]
        const lon = typeof coords[0] === 'number' ? coords[0] : null;
        const lat = typeof coords[1] === 'number' ? coords[1] : null;

        const fullAddress = formatPhotonAddress(p);
        const title = p.name || p.street || fullAddress;
        const subtitle = [p.locality, p.district, p.city || p.state, p.country]
          .filter(Boolean)
          .join(', ');

        return {
          id: `${p.osm_id || idx}-${idx}`,
          title,
          subtitle: subtitle || fullAddress,
          fullAddress: fullAddress || title,
          lat,
          lon,
          raw: p,
        };
      })
      .filter((item) => item.fullAddress && item.fullAddress.trim().length > 0);
  } catch (err) {
    if (err?.name === 'AbortError') return [];
    console.warn('[Photon OSM] Lỗi mạng:', err);
    return [];
  }
}

/**
 * Tìm tọa độ thực của một địa chỉ cụ thể qua Photon API
 * @param {string} address Chuỗi địa chỉ cần tìm tọa độ
 */
export async function geocodeAddress(address) {
  if (!address || typeof address !== 'string' || address.trim().length < 3) {
    return null;
  }
  const results = await searchAddress(address.trim(), 1);
  if (results.length > 0 && typeof results[0].lat === 'number' && typeof results[0].lon === 'number') {
    return {
      lat: results[0].lat,
      lon: results[0].lon,
      fullAddress: results[0].fullAddress,
    };
  }
  return null;
}

/**
 * Lấy địa chỉ thực tế từ tọa độ GPS qua Photon reverse-geocoding
 * @param {number} lat Vĩ độ
 * @param {number} lon Kinh độ
 */
export async function reverseGeocode(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !Array.isArray(data.features) || data.features.length === 0) {
      return null;
    }

    const p = data.features[0].properties || {};
    const fullAddress = formatPhotonAddress(p);
    return {
      lat,
      lon,
      title: p.name || p.street || fullAddress,
      fullAddress: fullAddress || p.name,
      raw: p,
    };
  } catch (err) {
    console.warn('[Photon OSM] Lỗi đảo ngược tọa độ:', err);
    return null;
  }
}

// Tọa độ kho hàng trung tâm của QLShop (128 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh)
export const SHOP_ORIGIN_COORDINATES = {
  lat: 10.7686,
  lon: 106.6890,
  address: '128 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
};

/**
 * Tính khoảng cách theo đường chim bay (km) giữa 2 tọa độ theo công thức Haversine
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number'
  ) {
    return null;
  }

  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Tính phí vận chuyển tự động dựa trên khoảng cách tọa độ OpenStreetMap
 * - Dưới 5 km: 15.000đ (Rất gần)
 * - 5 - 12 km: 20.000đ (Nội thành)
 * - 12 - 30 km: 30.000đ (Ngoại thành / Vùng ven)
 * - 30 - 200 km: 35.000đ (Liên tỉnh lân cận)
 * - Trên 200 km: 40.000đ (Toàn quốc)
 * - Đơn hàng từ 500.000đ: Miễn phí vận chuyển (0đ)
 */
export function calculateShippingFeeByDistance(distanceKm, subtotal = 0) {
  const FREE_SHIPPING_THRESHOLD = 500000;
  const isInternational = typeof distanceKm === 'number' && distanceKm > 2360;

  // 1. Ưu tiên kiểm tra điều kiện miễn phí vận chuyển nội địa (Đơn hàng từ 500.000đ trong nước)
  if (!isInternational && subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0) {
    return {
      fee: 0,
      isFree: true,
      tier: 'Miễn phí vận chuyển (Đơn ≥ 500k)',
      distanceKm,
    };
  }

  // 2. Kiểm tra dữ liệu khoảng cách hợp lệ
  if (distanceKm == null || isNaN(distanceKm) || distanceKm < 0) {
    return {
      fee: 30000,
      isFree: false,
      tier: 'Phí ship tiêu chuẩn',
      distanceKm: null,
    };
  }

  // 3. Phân bậc phí ship theo khoảng cách thực tế (Tuyến đường Việt Nam)
  if (distanceKm <= 5) {
    return {
      fee: 15000,
      isFree: false,
      tier: 'Nội thành gần (< 5 km)',
      distanceKm,
    };
  }
  
  if (distanceKm <= 12) {
    return {
      fee: 20000,
      isFree: false,
      tier: 'Nội thành (5 - 12 km)',
      distanceKm,
    };
  }
  
  if (distanceKm <= 30) {
    return {
      fee: 30000,
      isFree: false,
      tier: 'Ngoại thành / Vùng ven (12 - 30 km)',
      distanceKm,
    };
  }
  
  if (distanceKm <= 200) {
    return {
      fee: 35000,
      isFree: false,
      tier: 'Liên tỉnh lân cận (30 - 200 km)',
      distanceKm,
    };
  }
  
  if (distanceKm <= 2360) {
    return {
      fee: 40000,
      isFree: false,
      tier: 'Toàn quốc Bắc - Nam',
      distanceKm,
    };
  }

  // 4. Tuyến vận chuyển Quốc tế (Tính theo cự ly toàn cầu từ kho Việt Nam)
  if (distanceKm <= 5000) {
    return {
      fee: 150000,
      isFree: false,
      tier: 'Vận chuyển Quốc tế (Châu Á / Đông Nam Á)',
      distanceKm,
    };
  }

  return {
    fee: 350000,
    isFree: false,
    tier: 'Vận chuyển Quốc tế (Âu / Mỹ / Toàn cầu)',
    distanceKm,
  };
}


export const addressService = {
  searchAddress,
  geocodeAddress,
  reverseGeocode,
  formatPhotonAddress,
  getMapEmbedUrl,
  getOpenStreetMapUrl,
  getGoogleMapsUrl,
  SHOP_ORIGIN_COORDINATES,
  calculateDistanceKm,
  calculateShippingFeeByDistance,
};

export default addressService;
