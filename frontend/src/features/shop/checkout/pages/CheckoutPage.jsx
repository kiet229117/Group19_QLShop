import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import ProductBreadcrumb from '../../../../components/shop/common/ProductBreadcrumb';
import ShopEmptyState from '../../../../components/shop/common/ShopEmptyState';
import ShopButton from '../../../../components/shop/common/ShopButton';
import { useShopState } from '../../shared/context/ShopStateContext';
import { shopPaths } from '../../shopPaths';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import CheckoutSummary from '../components/CheckoutSummary';

function validateCheckoutForm(values) {
  const errors = {};
  if (!values.recipientName.trim()) {
    errors.recipientName = 'Vui lòng nhập họ và tên người nhận.';
  } else if (values.recipientName.trim().length < 2) {
    errors.recipientName = 'Họ và tên cần có ít nhất 2 ký tự.';
  }

  const cleanPhone = values.recipientPhone.replace(/\s+/g, '');
  if (!cleanPhone) {
    errors.recipientPhone = 'Vui lòng nhập số điện thoại liên hệ.';
  } else if (!/^0\d{8,10}$/.test(cleanPhone)) {
    errors.recipientPhone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0, gồm 9–11 chữ số).';
  }

  if (
    values.recipientEmail.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.recipientEmail.trim())
  ) {
    errors.recipientEmail = 'Địa chỉ email không đúng định dạng.';
  }

  if (!values.shippingAddress.trim()) {
    errors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng chi tiết.';
  } else if (values.shippingAddress.trim().length < 10) {
    errors.shippingAddress = 'Địa chỉ giao hàng quá ngắn, vui lòng ghi rõ số nhà/đường/quận.';
  }

  return errors;
}

/**
 * Trang Thanh toán (`/shop/checkout`).
 * Chỉ hiển thị các Voucher mà khách hàng đang sở hữu và tự động tặng Voucher mới sau khi đặt hàng.
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartSummary,
    vouchers,
    appliedVoucherCode,
    applyVoucher,
    profile,
    placeOrder,
  } = useShopState();

  const checkoutItems =
    cartSummary.selectedItems.length > 0 ? cartSummary.selectedItems : cartItems;

  const [formValues, setFormValues] = useState({
    recipientName: profile?.fullname || '',
    recipientPhone: profile?.phone || '',
    recipientEmail: profile?.email || '',
    shippingAddress: profile?.defaultAddress || '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
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
    const validationErrors = validateCheckoutForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const createdOrder = await placeOrder({
      ...formValues,
      paymentMethod,
    });
    navigate(shopPaths.checkoutSuccess(createdOrder.id));
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
            onSelectSavedAddress={handleSelectSavedAddress}
            onChangeField={handleFieldChange}
          />

          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        </div>

        <div className="lg:col-span-5">
          <CheckoutSummary
            items={checkoutItems}
            summary={cartSummary}
            vouchers={vouchers}
            appliedVoucherCode={appliedVoucherCode}
            onApplyVoucher={applyVoucher}
          />
        </div>
      </form>
    </div>
  );
}
