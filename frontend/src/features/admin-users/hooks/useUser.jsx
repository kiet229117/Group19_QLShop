import { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '../services/userService';

// Helper tạo thông tin định danh & phân cấp dựa trên dữ liệu database thật
const enrichUserData = (u, idx = 0) => {
  const roleUpper = (u.role || '').toUpperCase();
  const tier =
    roleUpper === 'ADMIN'
      ? 'Quản trị viên'
      : roleUpper === 'STAFF'
      ? 'Nhân viên'
      : 'Thành viên';

  const tierClass =
    roleUpper === 'ADMIN'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : roleUpper === 'STAFF'
      ? 'bg-blue-50 text-blue-800 border-blue-200'
      : 'bg-slate-100 text-slate-800 border-slate-200';

  const tierIcon = roleUpper === 'ADMIN' ? '👑' : roleUpper === 'STAFF' ? '🛡️' : '👤';
  const isActive = u.active !== false;

  return {
    id: u.id,
    userCode: `#USR-${String(u.id).padStart(4, '0')}`,
    name: u.name || u.fullname || u.username || 'Khách hàng',
    username: u.username,
    email: u.email || `${u.username || 'user'}@qlshop.com`,
    phone: u.phone || 'Chưa cập nhật',
    address: u.address || 'Chưa cập nhật địa chỉ',
    gender: u.gender || 'Nam',
    role: roleUpper || 'USER',
    registeredDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Mới tạo',
    vipMonth: roleUpper === 'ADMIN' ? 'Vĩnh viễn' : 'Tiêu chuẩn',
    tier,
    tierIcon,
    tierClass,
    ordersCount: 0,
    successRate: '100% Hoàn tất',
    totalSpent: 0,
    avgOrder: '0 đ',
    lastOrder: 'Chưa có đơn hàng',
    status: isActive ? 'Đang hoạt động' : 'Tạm khóa',
    statusType: isActive ? 'active' : 'blocked',
    active: isActive,
    points: 0,
    pointValue: '0 đ',
    vouchers: 0,
    avatar:
      u.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.username || 'User')}&background=0d9488&color=fff`,
    ordersList: [],
  };
};

export default function useUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Cache lịch sử đơn hàng của từng user trong bộ nhớ
  const ordersCache = useRef({});
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 1. Tải toàn bộ danh sách User từ Database (GET /api/users)
  const fetchUsers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      if (Array.isArray(data) && data.length > 0) {
        const enrichedList = data.map((u, idx) => enrichUserData(u, idx));
        setUsers(enrichedList);
        setSelectedUserId((prev) => {
          if (prev && enrichedList.some((u) => u.id === prev)) return prev;
          return enrichedList[0]?.id || null;
        });
      } else {
        setUsers([]);
        setSelectedUserId(null);
      }
    } catch (err) {
      console.warn('Lỗi kết nối /api/users từ backend:', err.message);
      setError(err.message || 'Không thể tải dữ liệu từ database');
      setUsers([]);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(false);
  }, [fetchUsers]);

  // Khách hàng đang được chọn xem hồ sơ chi tiết
  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0] || null;

  // 2. Tải đơn hàng thực tế của User đã chọn từ Database (GET /api/orders/user/{id})
  useEffect(() => {
    if (!selectedUser?.id) {
      setUserOrders([]);
      return;
    }
    const uid = selectedUser.id;

    if (ordersCache.current[uid]) {
      setUserOrders(ordersCache.current[uid]);
      return;
    }

    setLoadingOrders(true);
    userService
      .getUserOrders(uid)
      .then((data) => {
        if (data?.content && data.content.length > 0) {
          const formatted = data.content.map((o) => ({
            id: `#ORD-${o.id}`,
            date: o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : 'Gần đây',
            product: `Đơn hàng #${o.id} (${o.totalItems || 1} sản phẩm)`,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalAmount || 0),
            status:
              o.status === 'COMPLETED'
                ? 'Hoàn thành'
                : o.status === 'SHIPPING'
                ? 'Đang giao hàng'
                : o.status === 'CANCELLED'
                ? 'Đã hủy'
                : 'Đang xử lý',
            statusClass:
              o.status === 'COMPLETED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : o.status === 'SHIPPING'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : o.status === 'CANCELLED'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200',
          }));
          ordersCache.current[uid] = formatted;
          setUserOrders(formatted);
        } else {
          ordersCache.current[uid] = [];
          setUserOrders([]);
        }
      })
      .catch(() => {
        ordersCache.current[uid] = [];
        setUserOrders([]);
      })
      .finally(() => {
        setLoadingOrders(false);
      });
  }, [selectedUser?.id]);

  // 3. Thêm khách hàng mới trực tiếp vào Database (POST /api/users)
  const createUser = async (userData) => {
    const res = await userService.createUser(userData);
    await fetchUsers(true);
    return res;
  };

  // 4. Cập nhật thông tin khách hàng (PUT /api/users/{id})
  const updateUser = async (id, userData) => {
    const res = await userService.updateUser(id, userData);
    await fetchUsers(true);
    return res;
  };

  // 5. Xóa khách hàng khỏi Database (DELETE /api/users/{id})
  const deleteUser = async (id) => {
    await userService.deleteUser(id);
    delete ordersCache.current[id];
    await fetchUsers(true);
  };

  // 6. Khóa / Mở khóa tài khoản khách hàng
  const toggleStatus = async (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const newActive = target.active === false;
    await userService.updateUser(id, {
      name: target.name,
      username: target.username,
      email: target.email,
      phone: target.phone,
      address: target.address,
      role: target.role,
      active: newActive,
    });
    await fetchUsers(true);
  };

  return {
    users,
    loading,
    error,
    selectedUser,
    selectedUserId,
    setSelectedUserId,
    userOrders,
    loadingOrders,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
    refetch: fetchUsers,
  };
}
