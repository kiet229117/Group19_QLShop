import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Download,
  Plus,
  Bell,
  MessageSquare,
  LogOut,
  User,
  ChevronDown,
  Shield,
  CheckCircle2,
  Clock,
  ShoppingBag,
  AlertCircle,
  ExternalLink,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { toast } from '../common/Toast';
import orderService from '../../features/admin-orders/services/orderService';
import chatService from '../../features/admin-chats/services/chatService';

const formatMoney = (amount) => Number(amount || 0).toLocaleString('vi-VN') + ' đ';

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState(new Set());
  const prevPaidIdsRef = useRef(new Set());
  const prevMsgCountRef = useRef(null);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const chatRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Tải và đồng bộ dữ liệu Thông báo đơn hàng & Thanh toán
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await orderService.getAllOrders(0, 15);
      const orders = res?.content || (Array.isArray(res) ? res : []);

      const list = [];
      const currentPaidIds = new Set();

      orders.forEach((o) => {
        // Thông báo Đã thanh toán thành công
        if (o.paymentStatus === 'PAID') {
          currentPaidIds.add(o.id);
          list.push({
            id: `pay-${o.id}`,
            orderId: o.id,
            type: 'PAYMENT_SUCCESS',
            title: 'Thanh toán thành công!',
            content: `Đơn #ORD-${o.id} đã nhận ${formatMoney(o.totalAmount)} qua ${
              o.paymentMethod === 'BANK_TRANSFER' ? 'MB Bank (Online)' : 'COD'
            }`,
            time: o.updatedAt || o.createdAt,
            color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            icon: CheckCircle2,
          });

          // Nếu phát hiện đơn mới thanh toán trong thời gian thực -> hiện thông báo toast
          if (prevPaidIdsRef.current.size > 0 && !prevPaidIdsRef.current.has(o.id)) {
            toast.success(
              `Khách hàng vừa thanh toán thành công đơn #ORD-${o.id} (${formatMoney(o.totalAmount)})!`,
              'Thanh toán thành công'
            );
          }
        }

        // Thông báo Đơn hàng mới chờ xác nhận
        if (o.status === 'PENDING') {
          list.push({
            id: `pending-${o.id}`,
            orderId: o.id,
            type: 'NEW_ORDER',
            title: 'Đơn hàng mới chờ duyệt',
            content: `Khách ${o.receiverName || 'Khách vãng lai'} vừa đặt đơn #ORD-${o.id} (${formatMoney(o.totalAmount)})`,
            time: o.createdAt,
            color: 'text-blue-700 bg-blue-50 border-blue-200',
            icon: ShoppingBag,
          });
        }

        // Thông báo Yêu cầu hủy đơn
        if (o.status === 'CANCEL_REQUESTED') {
          list.push({
            id: `cancel-${o.id}`,
            orderId: o.id,
            type: 'CANCEL_REQUEST',
            title: 'Khách yêu cầu hủy đơn',
            content: `Đơn #ORD-${o.id}: "${o.cancelReason || 'Khách muốn đổi ý'}"`,
            time: o.updatedAt || o.createdAt,
            color: 'text-amber-700 bg-amber-50 border-amber-200',
            icon: AlertCircle,
          });
        }
      });

      prevPaidIdsRef.current = currentPaidIds;
      setNotifications(list);
    } catch {
      // Bỏ qua lỗi ngầm khi backend chưa khởi động
    }
  }, []);

  // 2. Tải và đồng bộ dữ liệu Tin nhắn CSKH
  const fetchConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      if (Array.isArray(data)) {
        setConversations(data);
        const totalMsgs = data.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

        if (prevMsgCountRef.current !== null && totalMsgs > prevMsgCountRef.current) {
          toast.info('Bạn vừa có tin nhắn mới từ khách hàng!', 'Tin nhắn CSKH');
        }
        prevMsgCountRef.current = totalMsgs;
      }
    } catch {
      // Bỏ qua lỗi ngầm
    }
  }, []);

  // Polling định kỳ mỗi 10 giây để nhận thông báo và tin nhắn mới tức thì
  useEffect(() => {
    fetchNotifications();
    fetchConversations();
    const timer = setInterval(() => {
      fetchNotifications();
      fetchConversations();
    }, 10000);
    return () => clearInterval(timer);
  }, [fetchNotifications, fetchConversations]);

  const handleLogout = async () => {
    await logout();
    toast.info('Bạn đã đăng xuất khỏi hệ thống thành công!');
    navigate('/login');
  };

  const handleMarkAllNotifRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadNotifIds(allIds);
    toast.success('Đã đánh dấu đọc tất cả thông báo!');
  };

  const handleClickNotif = (notif) => {
    setReadNotifIds((prev) => new Set([...prev, notif.id]));
    setIsNotifOpen(false);
    navigate('/admin/orders');
  };

  const handleClickChat = (convId) => {
    setIsChatOpen(false);
    navigate(convId ? `/admin/chats?conversationId=${convId}` : '/admin/chats');
  };

  // Số lượng thông báo và tin nhắn chưa đọc
  const unreadNotifCount = notifications.filter((n) => !readNotifIds.has(n.id)).length;
  const unreadChatCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const displayName = user?.fullname || 'Admin QLShop';
  const roleName = (user?.role || '').toUpperCase();
  const displayRole =
    roleName === 'ADMIN'
      ? 'Quản trị viên'
      : roleName === 'STAFF'
      ? 'Nhân viên'
      : user?.role
      ? `Quyền: ${user.role}`
      : 'Trưởng ca CSKH';

  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'AD';

  let breadcrumb = {
    group: 'Sản phẩm & Kho',
    page: 'Danh sách sản phẩm & biến thể',
    title: 'Sản phẩm',
    searchPlaceholder: 'Tìm theo Tên, SKU, Barcode, S... [⌘K]',
    addBtnLabel: 'Thêm sản phẩm mới',
  };

  if (location.pathname.includes('/categories')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Danh mục (Category)',
      title: 'Danh mục',
      searchPlaceholder: 'Tìm kiếm nhanh tên, slug hoặc... [⌘K]',
      addBtnLabel: 'Thêm danh mục',
    };
  } else if (location.pathname.includes('/brands')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Thương hiệu (Brand)',
      title: 'Thương hiệu',
      searchPlaceholder: 'Tìm kiếm nhanh tên thương hiệu, mã Brand... [⌘K]',
      addBtnLabel: 'Thêm mới',
    };
  } else if (location.pathname.includes('/goods-receipts')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Nhập kho (Goods Receipt)',
      title: 'Phiếu nhập',
      searchPlaceholder: 'Tìm kiếm mã phiếu nhập, NCC (FPT, DGW...)... [⌘K]',
      addBtnLabel: 'Tạo Phiếu Nhập',
    };
  } else if (location.pathname.includes('/suppliers')) {
    breadcrumb = {
      group: 'Sản phẩm & Kho',
      page: 'Nhà cung cấp (Supplier)',
      title: 'Nhà cung cấp',
      searchPlaceholder: 'Tìm kiếm nhà cung cấp, mã số thuế... [⌘K]',
      addBtnLabel: 'Thêm Nhà Cung Cấp',
    };
  } else if (location.pathname.includes('/users')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Quản lý Khách hàng (User Management)',
      title: 'Khách hàng',
      searchPlaceholder: 'Tìm kiếm tên, email, SĐT, mã user... [⌘K]',
      addBtnLabel: 'Thêm khách hàng',
    };
  } else if (location.pathname.includes('/chats')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Hộp thư CSKH (Omnichannel)',
      title: 'Hội thoại',
      searchPlaceholder: 'Tìm kiếm mã đơn #ORD, khách hàng, số điện thoại... [⌘K]',
      addBtnLabel: 'Tạo hội thoại',
    };
  } else if (location.pathname.includes('/comments')) {
    breadcrumb = {
      group: 'Khách hàng & Marketing',
      page: 'Đánh giá & Bình luận',
      title: 'Bình luận',
      searchPlaceholder: 'Tìm kiếm nội dung bình luận, người gửi... [⌘K]',
      addBtnLabel: 'Phản hồi bình luận',
    };
  } else if (location.pathname.includes('/orders')) {
    breadcrumb = {
      group: 'Bán hàng & Đơn hàng',
      page: 'Quản lý Đơn hàng (Orders)',
      title: 'Đơn hàng',
      searchPlaceholder: 'Tìm theo mã #ORD, tên khách, số điện thoại... [⌘K]',
      addBtnLabel: 'Tạo đơn mới',
    };
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
      {/* 1. Breadcrumb điều hướng */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-400 font-medium">{breadcrumb.group}</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-bold tracking-tight">{breadcrumb.page}</span>
      </div>

      {/* 2. Ô tìm kiếm + Nút hành động */}
      <div className="flex items-center gap-2.5">
        {/* Ô tìm kiếm */}
        <div className="relative w-64 md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={breadcrumb.searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-800 placeholder-gray-400 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Nút Xuất file */}
        <button
          type="button"
          onClick={() =>
            toast.success('Đang khởi tạo tệp báo cáo Excel, dữ liệu sẽ tự động tải xuống...', 'Xuất dữ liệu')
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition active:scale-95 shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>Xuất dữ liệu</span>
        </button>

        {/* Nút Thêm mới */}
        <button
          type="button"
          onClick={() => toast.info(`Mở cửa sổ thêm mới ${breadcrumb.title.toLowerCase()}`, 'Thao tác nhanh')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-xs font-bold text-white transition active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{breadcrumb.addBtnLabel}</span>
        </button>

        {/* =========================================================================
            3. KHU VỰC THÔNG BÁO CHUÔNG & HỘP THƯ TIN NHẮN (LIVE BADGE & DROPDOWNS)
            ========================================================================= */}
        <div className="flex items-center gap-1 text-gray-500 ml-1">
          {/* NÚT CHUÔNG THÔNG BÁO (Báo Thanh toán & Đơn hàng mới) */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsChatOpen(false);
                setIsProfileOpen(false);
              }}
              className={`p-2 rounded-xl transition relative cursor-pointer ${
                isNotifOpen ? 'bg-emerald-50 text-emerald-800' : 'hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Xem thông báo thanh toán và đơn hàng mới"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs animate-bounce">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>

            {/* POPUP DROPDOWN THÔNG BÁO */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 text-xs overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-zinc-50/50">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-gray-900 text-sm">Thông báo hệ thống</span>
                    {unreadNotifCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                        {unreadNotifCount} mới
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotifRead}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Đã đọc tất cả</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      <Bell className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                      <p className="font-medium text-xs">Chưa có thông báo nào mới</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.icon;
                      const isRead = readNotifIds.has(n.id);
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleClickNotif(n)}
                          className={`p-3.5 hover:bg-gray-50 transition cursor-pointer flex items-start gap-3 ${
                            isRead ? 'opacity-60' : 'bg-emerald-50/20'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 border ${n.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-bold text-gray-900 truncate">{n.title}</p>
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {n.time
                                  ? new Date(n.time).toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Vừa xong'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">
                              {n.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/admin/orders');
                    }}
                    className="w-full py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition flex items-center justify-center gap-1"
                  >
                    <span>Xem tất cả danh sách đơn hàng &amp; thanh toán</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* NÚT TIN NHẮN (Báo Tin nhắn từ khách hàng CSKH) */}
          <div className="relative" ref={chatRef}>
            <button
              type="button"
              onClick={() => {
                setIsChatOpen(!isChatOpen);
                setIsNotifOpen(false);
                setIsProfileOpen(false);
              }}
              className={`p-2 rounded-xl transition relative cursor-pointer ${
                isChatOpen ? 'bg-emerald-50 text-emerald-800' : 'hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Xem tin nhắn khách hàng CSKH"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadChatCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs">
                  {unreadChatCount > 9 ? '9+' : unreadChatCount}
                </span>
              )}
            </button>

            {/* POPUP DROPDOWN TIN NHẮN KHÁCH HÀNG */}
            {isChatOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 text-xs overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-zinc-50/50">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-gray-900 text-sm">Tin nhắn khách hàng</span>
                    {unreadChatCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {unreadChatCount} chưa đọc
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClickChat(null)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition flex items-center gap-1"
                  >
                    <span>Mở hộp thư</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {conversations.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                      <MessageSquare className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                      <p className="font-medium text-xs">Chưa có hội thoại nào</p>
                    </div>
                  ) : (
                    conversations.slice(0, 6).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleClickChat(c.id)}
                        className={`p-3.5 hover:bg-gray-50 transition cursor-pointer flex items-start gap-3 ${
                          c.unreadCount > 0 ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={
                              c.partnerAvatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                c.partnerName || 'Khách'
                              )}&background=0d9488&color=fff`
                            }
                            alt={c.partnerName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          {c.unreadCount > 0 && (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white absolute -top-0.5 -right-0.5"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-bold text-gray-900 truncate">
                              {c.partnerName || 'Khách hàng'}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {c.lastMessageAt
                                ? new Date(c.lastMessageAt).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Vừa xong'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-[11px] truncate mt-0.5">
                            {c.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                  <button
                    type="button"
                    onClick={() => handleClickChat(null)}
                    className="w-full py-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition flex items-center justify-center gap-1"
                  >
                    <span>Xem tất cả hội thoại trong Hộp thư CSKH</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Đường kẻ phân cách */}
        <div className="h-5 w-px bg-gray-200 mx-1"></div>

        {/* Profile Admin Dropdown & Logout */}
        <div className="relative pl-1 select-none" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
              setIsChatOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition focus:outline-hidden cursor-pointer"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border border-emerald-300"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center border border-emerald-200">
                {initials}
              </div>
            )}
            <div className="text-left hidden xl:block leading-tight">
              <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]">{displayName}</p>
              <p className="text-[10px] text-gray-400 font-medium">{displayRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:block" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-gray-100">
                <div className="font-bold text-slate-900 truncate">{displayName}</div>
                <div className="text-[11px] text-gray-400 truncate">{user?.email || 'admin@qlshop.vn'}</div>
                {user?.role && (
                  <span className="inline-block mt-1 px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Vai trò: {user.role}
                  </span>
                )}
              </div>

              <div className="py-1">
                <Link
                  to="/admin/users"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Hồ sơ người dùng</span>
                </Link>
                <Link
                  to="/admin/settings/general"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Cài đặt hệ thống</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Đăng xuất (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
