"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  Phone,
  User,
  Package,
  Clock,
  Loader2,
  AlertTriangle,
  ShoppingBag,
  Truck,
  QrCode,
  Copy,
  Check,
} from "lucide-react";
import { app } from "@/config/constants";
import {
  getConfirmation,
  confirmOrder,
  type ConfirmationData,
} from "@/lib/api/services/orderConfirmService";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

function formatTimeRemaining(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Hết hạn";
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins} phút ${secs} giây`;
}

function buildVietQRUrl(
  bankCode: string,
  accountNumber: string,
  accountName: string,
  amount: number,
  content: string,
) {
  const encoded = encodeURIComponent(content);
  const encodedName = encodeURIComponent(accountName);
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encoded}&accountName=${encodedName}`;
}

export default function ConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [data, setData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState<{
    orderId: string;
    orderNumber: string;
    paymentMethod: string;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "bank_transfer">("cod");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load confirmation data
  useEffect(() => {
    if (!token) return;
    getConfirmation(token)
      .then((res) => {
        setData(res);
        setTimeLeft(formatTimeRemaining(res.expiresAt));
      })
      .catch((err: any) => {
        setError(
          err?.message || "Link xác nhận không hợp lệ hoặc đã hết hạn."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(data.expiresAt);
      setTimeLeft(remaining);
      if (remaining === "Hết hạn") {
        setError("Link xác nhận đã hết hạn. Vui lòng liên hệ hotline.");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!token || confirming) return;
    setConfirming(true);
    try {
      const result = await confirmOrder(token, selectedPayment);
      setConfirmed({ ...result, paymentMethod: selectedPayment });

      // Notify chatbot widget in other tab via BroadcastChannel
      try {
        const channel = new BroadcastChannel("natro_chatbot");
        channel.postMessage({
          type: "order_confirmed",
          orderNumber: result.orderNumber,
          message: `Đơn hàng #${result.orderNumber} đã được xác nhận thành công! Cảm ơn anh/chị đã đặt hàng tại ${app.shopName}. Đơn hàng sẽ được xử lý và giao đến anh/chị trong thời gian sớm nhất. Mọi thắc mắc hoặc thay đổi đơn hàng, vui lòng liên hệ hotline 0347.366.345.`,
        });
        channel.close();
      } catch {}
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setConfirming(false);
    }
  }, [token, confirming, selectedPayment]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef6f5]">
        <div className="text-center space-y-3">
          <Loader2 size={40} className="animate-spin text-blue-1 mx-auto" />
          <p className="text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef6f5] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Không thể xác nhận
          </h1>
          <p className="text-gray-500">{error}</p>
          <a
            href={`tel:${app.phones?.[0]}`}
            className="inline-block px-6 py-2.5 bg-blue-1 text-white rounded-xl font-semibold hover:bg-[#18958e] transition-colors"
          >
            Gọi hotline {app.phones?.[0]}
          </a>
        </div>
      </div>
    );
  }

  // Success state
  if (confirmed) {
    const isBankTransfer = confirmed.paymentMethod === "bank_transfer";
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef6f5] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isBankTransfer ? "bg-indigo-100" : "bg-green-100"}`}>
            <CheckCircle size={32} className={isBankTransfer ? "text-indigo-600" : "text-green-600"} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            {isBankTransfer ? "Đơn hàng đã ghi nhận!" : "Đặt hàng thành công!"}
          </h1>
          <p className="text-gray-500">
            Mã đơn hàng:{" "}
            <span className={`font-bold ${isBankTransfer ? "text-indigo-600" : "text-blue-1"}`}>
              {confirmed.orderNumber}
            </span>
          </p>
          <div className="text-[14px] text-gray-500 space-y-2 text-left bg-gray-50 rounded-xl p-4">
            {isBankTransfer ? (
              <>
                <p>Chúng tôi sẽ xác nhận đơn hàng ngay sau khi nhận được thanh toán.</p>
                <p>
                  Nếu đã chuyển khoản, vui lòng chờ{" "}
                  <span className="font-semibold">5–15 phút</span> để bộ phận
                  kế toán xác nhận.
                </p>
              </>
            ) : (
              <>
                <p>
                  Cảm ơn anh/chị đã tin tưởng đặt hàng tại{" "}
                  <span className="font-semibold text-blue-1">{app.shopName}</span>!
                </p>
                <p>Đơn hàng sẽ được xử lý và giao đến anh/chị trong thời gian sớm nhất.</p>
              </>
            )}
            <p>
              Mọi thắc mắc, vui lòng liên hệ:{" "}
              <a
                href={`tel:${app.phones?.[0]}`}
                className="font-semibold text-blue-1 hover:underline"
              >
                {app.phones?.[0]}
              </a>
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className={`px-6 py-2.5 text-white rounded-xl font-semibold transition-colors ${
              isBankTransfer
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-blue-1 hover:bg-[#18958e]"
            }`}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const transferContent = `DUC STORE ${token.slice(0, 8).toUpperCase()}`;
  const qrUrl =
    data.bankInfo?.accountNumber
      ? buildVietQRUrl(
          data.bankInfo.bankCode,
          data.bankInfo.accountNumber,
          data.bankInfo.accountName,
          data.total,
          transferContent,
        )
      : null;

  return (
    <div className="min-h-screen bg-[#eef6f5] py-8 px-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-1/10 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag size={28} className="text-blue-1" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Xác nhận đặt hàng
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-orange-500">
            <Clock size={14} />
            <span className="text-[14px] font-medium">
              Còn lại: {timeLeft}
            </span>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <h2 className="text-[15px] font-bold text-gray-800">
            Thông tin người nhận
          </h2>
          <div className="space-y-2 text-[14px]">
            <div className="flex items-center gap-2 text-gray-600">
              <User size={16} className="text-blue-1 flex-shrink-0" />
              <span>{data.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} className="text-blue-1 flex-shrink-0" />
              <span>{data.customerPhone}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="text-blue-1 flex-shrink-0 mt-0.5" />
              <span>
                {[
                  data.shippingAddress.street,
                  data.shippingAddress.ward,
                  data.shippingAddress.district,
                  data.shippingAddress.city,
                ]
                  .map((p) => (p || "").trim())
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <h2 className="text-[15px] font-bold text-gray-800">
            Sản phẩm đặt mua
          </h2>
          <div className="space-y-3">
            {data.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Package size={20} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-800 truncate">
                    {item.productName}
                  </p>
                  {item.variantName && (
                    <p className="text-[13px] text-gray-400">
                      {item.variantName}
                    </p>
                  )}
                  <p className="text-[14px] text-gray-500">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <p className="text-[14px] font-semibold text-blue-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-2">
          <div className="flex justify-between text-[14px] text-gray-600">
            <span>Tạm tính</span>
            <span>{formatPrice(data.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[14px] text-gray-600">
            <span>Phí vận chuyển</span>
            <span>
              {data.shippingFee > 0
                ? formatPrice(data.shippingFee)
                : "Miễn phí"}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="text-[15px] font-bold text-gray-800">
              Tổng cộng
            </span>
            <span className="text-[18px] font-bold text-blue-1">
              {formatPrice(data.total)}
            </span>
          </div>
        </div>

        {/* Payment method selector */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <h2 className="text-[15px] font-bold text-gray-800">
            Phương thức thanh toán
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* COD */}
            <button
              onClick={() => setSelectedPayment("cod")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedPayment === "cod"
                  ? "border-blue-1 bg-blue-1/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Truck
                size={28}
                className={
                  selectedPayment === "cod" ? "text-blue-1" : "text-gray-400"
                }
              />
              <span
                className={`text-[13px] font-semibold text-center leading-tight ${
                  selectedPayment === "cod" ? "text-blue-1" : "text-gray-600"
                }`}
              >
                Thanh toán khi nhận hàng
              </span>
            </button>

            {/* Bank transfer */}
            <button
              onClick={() => setSelectedPayment("bank_transfer")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedPayment === "bank_transfer"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <QrCode
                size={28}
                className={
                  selectedPayment === "bank_transfer"
                    ? "text-indigo-600"
                    : "text-gray-400"
                }
              />
              <span
                className={`text-[13px] font-semibold text-center leading-tight ${
                  selectedPayment === "bank_transfer"
                    ? "text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                Chuyển khoản ngân hàng
              </span>
            </button>
          </div>
        </div>

        {/* VietQR block */}
        {selectedPayment === "bank_transfer" && data.bankInfo && (
          <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
            <h2 className="text-[15px] font-bold text-gray-800">
              Thông tin chuyển khoản
            </h2>

            {/* QR code */}
            {qrUrl && (
              <div className="flex justify-center">
                <img
                  src={qrUrl}
                  alt="QR Chuyển khoản"
                  className="w-52 h-52 rounded-xl border border-gray-200 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Bank info rows */}
            <div className="space-y-2 text-[14px]">
              {[
                { label: "Ngân hàng", value: `${data.bankInfo.bankCode} Bank` },
                { label: "Số tài khoản", value: data.bankInfo.accountNumber },
                { label: "Chủ tài khoản", value: data.bankInfo.accountName },
                { label: "Số tiền", value: formatPrice(data.total) },
                { label: "Nội dung CK", value: transferContent },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-500 flex-shrink-0">{label}</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-gray-800 truncate">
                      {value}
                    </span>
                    <button
                      onClick={() => copyToClipboard(value, label)}
                      className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
                      title="Sao chép"
                    >
                      {copiedField === label ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[12px] text-amber-600 bg-amber-50 rounded-lg p-3">
              Vui lòng chuyển khoản đúng <strong>số tiền</strong> và{" "}
              <strong>nội dung</strong> để đơn hàng được xác nhận nhanh nhất.
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-[14px] text-red-600">{error}</p>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className={`w-full py-3.5 text-white text-[16px] font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${
            selectedPayment === "bank_transfer"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-blue-1 hover:bg-[#18958e]"
          }`}
        >
          {confirming ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <CheckCircle size={20} />
          )}
          {confirming
            ? "Đang xử lý..."
            : selectedPayment === "bank_transfer"
            ? "TÔI ĐÃ CHUYỂN KHOẢN"
            : "XÁC NHẬN ĐẶT HÀNG"}
        </button>

        <p className="text-center text-[13px] text-gray-400">
          Bằng việc xác nhận, bạn đồng ý với điều khoản sử dụng của{" "}
          {app.shopName}
        </p>
      </div>
    </div>
  );
}
