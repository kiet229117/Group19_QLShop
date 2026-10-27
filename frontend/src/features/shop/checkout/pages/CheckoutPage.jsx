import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { toast } from '../../../../components/common/Toast';
import { useShopState } from '../../shared/context/ShopStateContext';
import { shopPaths } from '../../shopPaths';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import CheckoutSummary from '../components/CheckoutSummary';
import { cleanSavedAddress, validateShippingAddress } from '../../shared/utils/addressUtils';

export function validateSingleCheckoutField(field, value) {
  const val = String(value ?? '').trim();

  if (field === 'recipientName') {
    if (!val) {
      return 'Vui lòng nhập họ và tên người nhận hàng.';
    }
    if (val.length < 2 || val.length > 100) {
      return 'Họ và tên người nhận phải từ 2 đến 100 ký tự.';
    }
    return '';
  }

  if (field === 'recipientPhone') {
    const cleanPhone = val.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.toLowerCase() === 'chưa cập nhật') {
      return 'Vui lòng nhập số điện thoại người nhận.';
    }
    if (!/^(0[35789])[0-9]{8}$/.test(cleanPhone)) {
      return 'Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09 - VD: 0912345678).';
    }
    return '';
  }

  if (field === 'recipientEmail') {
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return 'Địa chỉ email không đúng định dạng (VD: example@qlshop.vn).';
    }
    return '';
  }

  if (field === 'shippingAddress') {
    return validateShippingAddress(val);
  }

  return '';
}

function validateCheckoutForm(values) {
  const errors = {};
  ['recipientName', 'recipientPhone', 'recipientEmail', 'shippingAddress'].forEach((field) => {
    const msg = validateSingleCheckoutField(field, values[field]);
    if (msg) {
      errors[field] = msg;
    }
  });
  return errors;
}

/**
 * Trang Thanh toán (`/shop/checkout`).
 * Chặn đặt hàng tuyệt đối nếu người dùng chưa cập nhật hoặc nhập sai địa chỉ nhận hàng.
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartSummary,
    vouchers,
    catalogVouchers,
    usedVoucherCodes,
    appliedVoucherCode,
    applyVoucher,
    profile,
    updateProfile,
    placeOrder,
  } = useShopState();

  const checkoutItems =
    cartSummary.selectedItems.length > 0 ? cartSummary.selectedItems : cartItems;

  const cleanDefaultAddr = cleanSavedAddress(profile?.defaultAddress);

  const [formValues, setFormValues] = useState({
    recipientName: profile?.fullname || '',
    recipientPhone:
      profile?.phone && String(profile.phone).trim().toLowerCase() !== 'chưa cập nhật'
        ? profile.phone
        : '',
    recipientEmail: profile?.email || '',
    shippingAddress: cleanDefaultAddr,
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Đồng bộ lại formValues khi thông tin tài khoản (profile.id / defaultAddress) thay đổi
  useEffect(() => {
    const nextAddr = cleanSavedAddress(profile?.defaultAddress);
    const nextPhone =
      profile?.phone && String(profile.phone).trim().toLowerCase() !== 'chưa cập nhật'
        ? String(profile.phone).trim()
        : '';

    setFormValues((prev) => ({
      ...prev,
      recipientName: profile?.fullname || prev.recipientName || '',
      recipientPhone: nextPhone || prev.recipientPhone || '',
      recipientEmail: profile?.email || prev.recipientEmail || '',
      shippingAddress: nextAddr,
    }));
  }, [profile?.id, profile?.fullname, profile?.phone, profile?.email, profile?.defaultAddress]);

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field] || errors[field]) {
      const msg = validateSingleCheckoutField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) {
          next[field] = msg;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  // Khi người dùng click vào ô rồi bỏ qua (nhấp ra ngoài / chuyển ô khác), báo lỗi ngay lập tức
  const handleBlurField = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const msg = validateSingleCheckoutField(field, formValues[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) {
        next[field] = msg;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSelectSavedAddress = (addr) => {
    setFormValues((prev) => ({
      ...prev,
      recipientName: addr.recipientName || prev.recipientName,
      recipientPhone: addr.phone || prev.recipientPhone,
      shippingAddress: addr.address,
    }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      recipientName: true,
      recipientPhone: true,
      recipientEmail: true,
      shippingAddress: true,
    });

    const validationErrors = validateCheckoutForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const priorityField = validationErrors.shippingAddress
        ? 'shippingAddress'
        : Object.keys(validationErrors)[0];
      const priorityMessage = validationErrors[priorityField];
      toast.error(
        priorityMessage || 'Bạn chưa cập nhật đầy đủ thông tin và địa chỉ nhận hàng!'
      );

      const el = document.querySelector(`[name="${priorityField}"]`);
      if (el && typeof el.focus === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    try {
      const trimmedAddress = formValues.shippingAddress.trim();
      const createdOrder = await placeOrder({
        ...formValues,
        shippingAddress: trimmedAddress,
        recipientPhone: formValues.recipientPhone.replace(/\s+/g, ''),
        paymentMethod,
      });

      // Nếu hồ sơ cá nhân trước đó chưa có địa chỉ mặc định thì tự động cập nhật luôn
      if (!cleanDefaultAddr && trimmedAddress.length >= 10) {
        try {
          await updateProfile?.({ defaultAddress: trimmedAddress });
        } catch {
          // ignore
        }
      }

      navigate(shopPaths.checkoutSuccess(createdOrder.id));
    } catch (err) {
      const backendData = err?.response?.data;
      const backendMsg =
        backendData?.message ||
        (typeof backendData === 'string' ? backendData : null) ||
        err?.message ||
        'Không thể đặt hàng. Vui lòng kiểm tra lại thông tin giao hàng!';
      toast.error(backendMsg);

      // Nếu lỗi do tồn kho hoặc hết hàng đồng thời
      const lower = String(backendMsg).toLowerCase();
      if (
        lower.includes('trong kho') ||
        lower.includes('chỉ còn') ||
        lower.includes('hết hàng') ||
        lower.includes('không đủ')
      ) {
        toast.warning('Tồn kho đã thay đổi do có khách vừa đặt. Vui lòng quay lại giỏ hàng kiểm tra lại số lượng.');
      }
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
        <ProductBreadcrumb
          items={[
            { label: 'Giỏ hàng', to: shopPaths.cart() },
            { label: 'Thanh toán' },
          ]}
        />
        <ShopEmptyState
          icon={ShoppingBag}
          title="Chưa có sản phẩm nào để thanh toán"
          description="Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán."
          action={
            <ShopButton to={shopPaths.products()} variant="primary">
              Khám phá sản phẩm
            </ShopButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <ProductBreadcrumb
        items={[
          { label: 'Giỏ hàng', to: shopPaths.cart() },
          { label: 'Thanh toán' },
        ]}
      />

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Hoàn tất đơn hàng
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          Thanh toán & Giao hàng
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-7">
          <ShippingAddressForm
            values={formValues}
            errors={errors}
            savedAddresses={profile?.addresses || []}
            profileDefaultAddress={cleanDefaultAddr}
            onSelectSavedAddress={handleSelectSavedAddress}
            onChangeField={handleFieldChange}
            onBlurField={handleBlurField}
          />

          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        </div>

        <div className="lg:col-span-5">
          <CheckoutSummary
            items={checkoutItems}
            summary={cartSummary}
            vouchers={vouchers}
            catalogVouchers={catalogVouchers}
            usedVoucherCodes={usedVoucherCodes}
            appliedVoucherCode={appliedVoucherCode}
            onApplyVoucher={applyVoucher}
            shippingAddress={formValues.shippingAddress}
          />
        </div>
      </form>
    </div>
  );
}
