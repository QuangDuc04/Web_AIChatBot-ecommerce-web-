"use client";

import { useState } from "react";
import Link from "next/link";
import {
  lookupByContact,
  type OrderLookupByContactResponse,
} from "@/lib/api/services/orderService";
import { formatPrice } from "@/utils/priceFormatter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Order } from "@/types";
import {
  Search,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ArrowLeft,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_MAP: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-yellow-600 bg-yellow-50",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-blue-600 bg-blue-50",
    icon: CheckCircle,
  },
  processing: {
    label: "Đang xử lý",
    color: "text-indigo-600 bg-indigo-50",
    icon: Package,
  },
  shipping: {
    label: "Đang giao hàng",
    color: "text-purple-600 bg-purple-50",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao hàng",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-600 bg-red-50",
    icon: XCircle,
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "text-gray-600 bg-gray-50",
    icon: XCircle,
  },
};

function OrderCard({
  order,
  defaultExpanded,
}: {
  order: Order;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)",
      }}
    >
      {/* Order header — clickable */}
      <button
        type="button"
        className="w-full px-6 py-5 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="text-left">
          <p className="text-[13px] text-gray-400 mb-1">Mã đơn hàng</p>
          <p className="text-[16px] font-[800] text-gray-900 font-mono">
            #{order.orderNumber}
          </p>
          <p className="text-[13px] text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.color}`}
          >
            <statusInfo.icon size={14} />
            <span className="text-[13px] font-[700]">{statusInfo.label}</span>
          </div>
          <span className="text-[16px] font-[700] text-[#1a7a74]">
            {formatPrice(order.total)}
          </span>
          {expanded ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <>
          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-[14px] font-[600] text-gray-700 mb-3">
                Sản phẩm ({order.items.length})
              </p>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-[500] text-gray-800 line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-[13px] text-gray-400">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-[14px] font-[700] text-gray-900 shrink-0">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping info */}
          {order.guestAddress && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-gray-400" />
                <p className="text-[14px] font-[600] text-gray-600">
                  Địa chỉ giao hàng
                </p>
              </div>
              <p className="text-[14px] text-gray-500">
                {order.guestName} &middot; {order.guestPhone}
              </p>
              <p className="text-[14px] text-gray-500">
                {order.guestAddress.street}, {order.guestAddress.ward},{" "}
                {order.guestAddress.district}, {order.guestAddress.city}
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="px-6 py-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Tạm tính</span>
              <span className="font-[600] text-gray-700">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span className="font-[600] text-gray-700">
                {Number(order.shippingFee) === 0
                  ? "Miễn phí"
                  : formatPrice(order.shippingFee)}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-[14px]">
                <span className="text-green-600">Giảm giá</span>
                <span className="font-[600] text-green-600">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[16px] font-[700] pt-2 border-t border-gray-100">
              <span className="text-gray-900">Tổng cộng</span>
              <span className="text-[#1a7a74]">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Status timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-[14px] font-[600] text-gray-700 mb-3">
                Lịch sử đơn hàng
              </p>
              <div className="space-y-3">
                {order.statusHistory.map((entry: any, idx: number) => {
                  const info = STATUS_MAP[entry.status] || STATUS_MAP.pending;
                  return (
                    <div
                      key={entry.id || idx}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${info.color}`}
                      >
                        <info.icon size={14} />
                      </div>
                      <div>
                        <p className="text-[14px] font-[600] text-gray-800">
                          {info.label}
                        </p>
                        {entry.note && (
                          <p className="text-[13px] text-gray-500">
                            {entry.note}
                          </p>
                        )}
                        <p className="text-[12px] text-gray-400 mt-0.5">
                          {new Date(entry.createdAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function OrderLookupPage() {
  const [contact, setContact] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async () => {
    if (!contact.trim()) {
      setError("Vui lòng nhập số điện thoại hoặc email.");
      return;
    }

    setError(null);
    setOrders([]);
    setIsLoading(true);
    setSearched(true);

    try {
      const data = await lookupByContact(contact.trim());
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tìm thấy đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#edf9f8] flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-[#1a7a74]" />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-[800] text-gray-900 mb-2">
            Tra cứu đơn hàng
          </h1>
          <p className="text-[14px] text-gray-500">
            Nhập số điện thoại hoặc email để kiểm tra trạng thái đơn hàng
          </p>
        </div>

        {/* Search form */}
        <div
          className="bg-white rounded-2xl p-6 mb-6"
          style={{
            boxShadow:
              "0 1px 4px rgba(26,122,116,0.06), 0 4px 12px rgba(26,122,116,0.04)",
          }}
        >
          <div className="mb-4">
            <label className="block text-[14px] font-[600] text-gray-600 mb-1.5">
              Số điện thoại hoặc email đặt hàng
            </label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="VD: 0901234567 hoặc email@example.com"
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleLookup}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {isLoading ? "Đang tìm kiếm..." : "Tra cứu"}
          </Button>

          {error && (
            <div className="flex items-center gap-2 mt-4 text-[14px] text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-[14px] text-gray-500">
              Tìm thấy{" "}
              <span className="font-[700] text-gray-700">{orders.length}</span>{" "}
              đơn hàng
            </p>
            {orders.map((order, idx) => (
              <OrderCard
                key={order.id}
                order={order}
                defaultExpanded={orders.length === 1}
              />
            ))}
          </div>
        )}

        {searched && !isLoading && orders.length === 0 && !error && (
          <div className="text-center text-[14px] text-gray-400 py-8">
            Không tìm thấy đơn hàng nào.
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] font-[600] text-[#1a7a74] hover:text-[#15635e] transition-colors"
          >
            <ArrowLeft size={16} />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
