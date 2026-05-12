"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, ACTION_TYPES } from "@/context/CartContext";
import {
  calculateOrder,
  createOrder,
  type OrderCalculation,
} from "@/lib/api/services/checkoutService";
import { createPayment } from "@/lib/api/services/paymentService";
import { getActiveCoupons, type Coupon } from "@/lib/api/services/couponService";
import { formatPrice } from "@/utils/priceFormatter";
import { app, BANK_INFO } from "@/config/constants";
import { PaymentMethod } from "@/types/order";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  Tag,
  FileText,
  User,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Banknote,
  Wallet,
  AlertCircle,
} from "lucide-react";

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#edf9f8] flex items-center justify-center">
            <Icon size={16} className="text-[#1a7a74]" />
          </div>
          <h2 className="text-[16px] font-[700] text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment method options
// ---------------------------------------------------------------------------

const PAYMENT_METHODS = [
  { value: PaymentMethod.COD, label: "Thanh toán khi nhận hàng", desc: "COD", icon: Banknote },
  { value: PaymentMethod.BANK_TRANSFER, label: "Chuyển khoản ngân hàng", desc: "Bank Transfer", icon: CreditCard },
  { value: PaymentMethod.VNPAY, label: "Thanh toán qua VNPay", desc: "Online", icon: Wallet },
  { value: PaymentMethod.MOMO, label: "Ví MoMo", desc: "E-Wallet", icon: Wallet },
];

// ---------------------------------------------------------------------------
// Main checkout component — guest only
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const { carts, dispatch } = useCart();
  const router = useRouter();

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState({
    street: "",
    city: "",
    district: "",
    ward: "",
  });

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [customerNote, setCustomerNote] = useState("");
  const [calculation, setCalculation] = useState<OrderCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [showCoupons, setShowCoupons] = useState(false);

  // Cart is loaded from localStorage via CartProvider — no sync needed

  // Load active coupons
  useEffect(() => {
    getActiveCoupons().then(setActiveCoupons).catch(() => { });
  }, []);

  // Recalculate order totals
  useEffect(() => {
    if (carts.length === 0) return;
    const timer = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const result = await calculateOrder({
          items: carts.map(c => ({ productId: c.id, quantity: c.quantity, buyingUnitType: c.buyingUnitType })),
          couponCode: appliedCoupon ?? undefined,
          email: guestEmail.trim() || undefined,
          guestAddress: guestAddress.street
            ? {
              street: guestAddress.street,
              city: guestAddress.city,
              district: guestAddress.district,
              ward: guestAddress.ward,
            }
            : undefined,
        });
        setCalculation(result);
        setCouponError(null);
      } catch {
        // fallback
      } finally {
        setIsCalculating(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [carts, appliedCoupon, guestEmail, guestAddress]);

  const subtotal = carts.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const displayCalc = calculation ?? {
    subtotal,
    shippingFee: 0,
    tax: 0,
    discount: 0,
    total: subtotal,
  };

  const handlePlaceOrder = async () => {
    if (!guestName.trim()) { setSubmitError("Vui lòng nhập họ tên."); return; }
    if (!guestEmail.trim()) { setSubmitError("Vui lòng nhập email."); return; }
    if (!guestPhone.trim()) { setSubmitError("Vui lòng nhập số điện thoại."); return; }
    if (!guestAddress.street.trim() || !guestAddress.city.trim() || !guestAddress.district.trim()) {
      setSubmitError("Vui lòng nhập đầy đủ địa chỉ giao hàng.");
      return;
    }
    if (carts.length === 0) {
      setSubmitError("Giỏ hàng trống.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const order = await createOrder({
        items: carts.map(c => ({ productId: c.id, quantity: c.quantity, buyingUnitType: c.buyingUnitType })),
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        guestAddress: {
          street: guestAddress.street.trim(),
          city: guestAddress.city.trim(),
          district: guestAddress.district.trim(),
          ward: guestAddress.ward.trim(),
        },
        paymentMethod,
        customerNote: customerNote.trim() || undefined,
        couponCode: appliedCoupon ?? undefined,
      });

      // Clear cart after successful order
      await dispatch({ type: ACTION_TYPES.CLEAR_CART });

      if (paymentMethod === PaymentMethod.VNPAY || paymentMethod === PaymentMethod.MOMO) {
        const { paymentUrl } = await createPayment({
          orderId: order.id,
          method: paymentMethod,
        });
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }
      }

      router.push(`/thanh-toan/ket-qua?orderId=${order.id}&status=success`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể đặt hàng. Vui lòng thử lại.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemCount = carts.reduce((sum, item) => sum + item.quantity, 0);

  /* ── Empty cart ── */
  if (carts.length === 0) {
    return (
      <section className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#edf9f8] flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-[#1a7a74]" />
        </div>
        <h2 className="text-[22px] font-[700] text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-[15px] text-gray-500 mb-8">
          Bạn cần thêm sản phẩm trước khi thanh toán.
        </p>
        <Link href="/san-pham">
          <Button variant="primary">
            <ArrowLeft size={16} />
            Tiếp tục mua sắm
          </Button>
        </Link>
      </section>
    );
  }

  /* ── Main checkout ── */
  return (
    <section className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-[800] text-gray-900">
            Thanh toán
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {itemCount} sản phẩm
          </p>
        </div>
        <Link
          href="/gio-hang"
          className="flex items-center gap-2 text-[14px] font-[600] text-[#1a7a74] hover:text-[#15635e] transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại giỏ hàng
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* ═══ Left column ═══ */}
        <div className="flex-1 space-y-5">

          {/* ── Step 1: Customer info ── */}
          <Section icon={User} title="Thông tin người mua">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Họ và tên *</label>
                  <Input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Số điện thoại *</label>
                  <Input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Email *</label>
                  <Input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Step 2: Shipping address ── */}
          <Section icon={MapPin} title="Địa chỉ giao hàng">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Tỉnh/Thành phố *</label>
                <Input
                  value={guestAddress.city}
                  onChange={(e) => setGuestAddress((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Hồ Chí Minh"
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Quận/Huyện *</label>
                <Input
                  value={guestAddress.district}
                  onChange={(e) => setGuestAddress((p) => ({ ...p, district: e.target.value }))}
                  placeholder="Quận 1"
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Phường/Xã</label>
                <Input
                  value={guestAddress.ward}
                  onChange={(e) => setGuestAddress((p) => ({ ...p, ward: e.target.value }))}
                  placeholder="Bến Nghé"
                />
              </div>
              <div>
                <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">Địa chỉ cụ thể *</label>
                <Input
                  value={guestAddress.street}
                  onChange={(e) => setGuestAddress((p) => ({ ...p, street: e.target.value }))}
                  placeholder="Số nhà, tên đường..."
                />
              </div>
            </div>
          </Section>

          {/* ── Step 3: Payment method ── */}
          <Section icon={CreditCard} title="Phương thức thanh toán">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(({ value, label, desc, icon: PIcon }) => {
                const isSelected = paymentMethod === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                        ? "border-[#1a7a74] bg-[#edf9f8]/50"
                        : "border-gray-100 hover:border-[#1a7a74]/30"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-[#1a7a74] text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                      <PIcon size={18} />
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div>
                      <p className={`text-[14px] font-[600] ${isSelected ? "text-[#1a7a74]" : "text-gray-800"}`}>
                        {label}
                      </p>
                      <p className="text-[13px] text-gray-400">{desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Bank transfer details */}
            {paymentMethod === PaymentMethod.BANK_TRANSFER && (
              <div className="mt-4 p-4 bg-[#edf9f8]/50 rounded-xl border border-[#1a7a74]/10">
                <p className="text-[14px] font-[600] text-gray-800 mb-2">Thông tin chuyển khoản</p>
                <div className="text-[14px] text-gray-600 space-y-1">
                  <p>Ngân hàng: <strong>{BANK_INFO.bank}</strong></p>
                  <p>Số tài khoản: <strong className="font-mono">{BANK_INFO.accountNumber}</strong></p>
                  <p>Chủ TK: <strong>{BANK_INFO.accountHolder}</strong></p>
                </div>
                <Image
                  src={BANK_INFO.qrImage}
                  alt="QR Ngân hàng"
                  width={120}
                  height={120}
                  className="mt-3 rounded-xl"
                />
              </div>
            )}

            {/* MoMo details */}
            {paymentMethod === PaymentMethod.MOMO && (
              <div className="mt-4 p-4 bg-pink-50/50 rounded-xl border border-pink-200/50">
                <p className="text-[14px] font-[600] text-gray-800 mb-2">Thông tin MoMo</p>
                <p className="text-[14px] text-gray-600">
                  Số điện thoại: <strong>{app.phones[0]}</strong>
                </p>
                <Image
                  src="/assets/commons/qr_momo.png"
                  alt="QR MoMo"
                  width={120}
                  height={120}
                  className="mt-3 rounded-xl"
                />
              </div>
            )}
          </Section>

          {/* ── Step 4: Notes ── */}
          <Section icon={FileText} title="Ghi chú đơn hàng">
            <TextArea
              placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
              rows={3}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />
          </Section>
        </div>

        {/* ═══ Right column — Order summary ═══ */}
        <div className="lg:w-[400px] shrink-0">
          <div
            className="bg-white rounded-2xl sticky top-24 overflow-hidden"
            style={{
              boxShadow:
                "0 2px 8px rgba(26,122,116,0.06), 0 8px 24px rgba(26,122,116,0.04)",
            }}
          >
            {/* Cart items */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#edf9f8] flex items-center justify-center">
                  <ShoppingBag size={16} className="text-[#1a7a74]" />
                </div>
                <h2 className="text-[16px] font-[700] text-gray-900">
                  Đơn hàng ({itemCount})
                </h2>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {carts.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-[56px] h-[56px] rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-[500] text-gray-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        {formatPrice(item.price)}{item.unitLabel ? ` / ${item.unitLabel}` : ''} x {item.quantity}
                      </p>
                      {item.boxInfo && (
                        <p className="text-[12px] text-gray-400">{item.boxInfo}</p>
                      )}
                    </div>
                    <p className="text-[14px] font-[700] text-gray-900 shrink-0">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="px-5 py-4 border-t border-gray-100">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-[14px] font-[600] text-green-700">{appliedCoupon}</span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponInput("");
                      setCouponError(null);
                    }}
                    className="text-[13px] text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      placeholder="Mã giảm giá"
                      className="flex-1 !py-2"
                    />
                    <button
                      onClick={() => {
                        const code = couponInput.trim();
                        if (!code) {
                          setCouponError("Vui lòng nhập mã.");
                          return;
                        }
                        setAppliedCoupon(code);
                        setShowCoupons(false);
                      }}
                      className="px-4 py-2 bg-[#1a7a74] text-white text-[14px] font-[600] rounded-xl hover:bg-[#15635e] transition-colors shrink-0"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {activeCoupons.length > 0 && (
                    <button
                      onClick={() => setShowCoupons((v) => !v)}
                      className="text-[13px] text-[#1a7a74] font-[600] mt-2 hover:underline"
                    >
                      {showCoupons ? "Ẩn mã giảm giá" : `Xem ${activeCoupons.length} mã có sẵn`}
                    </button>
                  )}

                  {showCoupons && (
                    <div className="mt-3 space-y-2">
                      {activeCoupons.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between border border-dashed border-[#1a7a74]/30 rounded-xl px-3 py-2.5 bg-[#edf9f8]/30"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-[700] text-[#1a7a74] font-mono">{c.code}</p>
                            <p className="text-[12px] text-gray-500 mt-0.5">
                              {c.discountType === "percentage"
                                ? `Giảm ${c.discountValue}%`
                                : `Giảm ${formatPrice(c.discountValue)}`}
                              {c.minOrderValue > 0 && ` · Từ ${formatPrice(c.minOrderValue)}`}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setCouponInput(c.code);
                              setAppliedCoupon(c.code);
                              setShowCoupons(false);
                            }}
                            className="ml-3 text-[13px] font-[600] text-white bg-[#1a7a74] px-3 py-1 rounded-lg hover:bg-[#15635e] transition-colors shrink-0"
                          >
                            Dùng
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {couponError && (
                <p className="text-[13px] text-red-500 mt-2">{couponError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-[600] text-gray-800">
                  {isCalculating ? "..." : formatPrice(displayCalc.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-[600] text-gray-800">
                  {isCalculating
                    ? "..."
                    : displayCalc.shippingFee === 0
                      ? "Miễn phí"
                      : formatPrice(displayCalc.shippingFee)}
                </span>
              </div>
              {(displayCalc.discount ?? 0) > 0 && (
                <div className="flex justify-between text-[14px]">
                  <span className="text-green-600">Giảm giá</span>
                  <span className="font-[600] text-green-600">
                    -{formatPrice(displayCalc.discount)}
                  </span>
                </div>
              )}
            </div>

            {/* Total + Submit */}
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[16px] font-[700] text-gray-900">Tổng cộng</span>
                <span className="text-[24px] font-[800] text-[#1a7a74]">
                  {isCalculating ? "..." : formatPrice(displayCalc.total)}
                </span>
              </div>

              {carts.some((item) => !item.price || Number(item.price) === 0) && (
                <div className="flex items-start gap-2 text-[14px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2.5 rounded-xl mb-3">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>Đơn hàng có sản phẩm cần liên hệ báo giá. Chúng tôi sẽ liên hệ xác nhận giá ưu đãi sau khi bạn đặt hàng.</span>
                </div>
              )}

              {submitError && (
                <div className="flex items-start gap-2 text-[14px] text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl mb-3">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {submitError}
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={isSubmitting || carts.length === 0}
                onClick={handlePlaceOrder}
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </Button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 mt-4 text-[12px] text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Bảo mật
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={12} />
                  Giao nhanh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
