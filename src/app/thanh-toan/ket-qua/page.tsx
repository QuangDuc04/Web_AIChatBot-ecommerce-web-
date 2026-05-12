"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPaymentStatus } from "@/lib/api/services/paymentService";
import { formatPrice } from "@/utils/priceFormatter";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import type { Order } from "@/types/order";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const statusParam = searchParams.get("status");

  const [order, setOrder] = useState<Order | null>(null);
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const poll = async () => {
      try {
        if (statusParam === "success") {
          setIsPaid(true);
          setIsLoading(false);
          return;
        }

        // For VNPay/MoMo, poll payment status
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const payment = await getPaymentStatus(orderId);
            if (payment.status === "completed") {
              setIsPaid(true);
              clearInterval(interval);
              setIsLoading(false);
            } else if (payment.status === "failed" || attempts >= maxAttempts) {
              setIsPaid(false);
              clearInterval(interval);
              setIsLoading(false);
            }
          } catch {
            if (attempts >= maxAttempts) {
              setIsPaid(false);
              clearInterval(interval);
              setIsLoading(false);
            }
          }
        }, 2000);

        return () => clearInterval(interval);
      } catch {
        setIsPaid(false);
        setIsLoading(false);
      }
    };

    poll();
  }, [orderId, statusParam]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <Loader2 size={48} className="text-blue-main animate-spin" />
        <p className="text-gray-500 text-sm">Đang xác nhận thanh toán...</p>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="text-center py-16">
        <XCircle size={64} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-main mb-2">Đơn hàng không hợp lệ</h2>
        <p className="text-gray-500 mb-6">Không tìm thấy thông tin đơn hàng.</p>
        <Link href="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    );
  }

  if (isPaid === false) {
    return (
      <div className="text-center py-16">
        <XCircle size={64} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-main mb-2">Thanh toán thất bại</h2>
        <p className="text-gray-500 mb-6">
          Giao dịch không thành công. Vui lòng thử lại.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/thanh-toan">
            <Button>Thử lại</Button>
          </Link>
          <Link href="/">
            <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-main mb-2">Đặt hàng thành công!</h2>
      <p className="text-gray-500 mb-2">
        Cảm ơn bạn đã mua hàng tại <span className="text-blue-main font-medium">Halo</span>.
      </p>

      {order && (
        <>
          <p className="text-sm text-gray-400 mb-6">
            Mã đơn hàng:{" "}
            <span className="font-mono font-medium text-main">#{order.orderNumber}</span>
          </p>

          <div className="max-w-sm mx-auto border border-gray-200 rounded-[8px] p-4 mb-6 text-sm text-left">
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Tổng tiền hàng</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Phí vận chuyển</span>
              <span>
                {order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-main border-t border-gray-100 pt-2 mt-2">
              <span>Tổng thanh toán</span>
              <span className="text-blue-main">{formatPrice(order.total)}</span>
            </div>
          </div>
        </>
      )}

      <p className="text-sm text-gray-500 mb-6">
        Thông tin đơn hàng đã được gửi tới email của bạn. Bạn có thể tra cứu đơn hàng bất cứ lúc nào.
      </p>

      <div className="flex justify-center gap-3">
        <Link href="/tra-cuu-don-hang">
          <Button>
            <Search size={16} />
            Tra cứu đơn hàng
          </Button>
        </Link>
        <Link href="/">
          <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="container py-8">
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 size={40} className="text-blue-main animate-spin" />
          </div>
        }
      >
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
