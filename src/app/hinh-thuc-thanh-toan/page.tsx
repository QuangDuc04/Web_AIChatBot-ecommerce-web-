import PolicyPage from "@/components/PolicyPage";
import { CreditCard } from "lucide-react";
import { app, BANK_INFO } from "@/config/constants";

export default function PaymentPolicy() {
  return (
    <PolicyPage
      title="Hình thức thanh toán"
      description="Các phương thức thanh toán an toàn, nhanh chóng được hỗ trợ tại cửa hàng của chúng tôi."
      icon={<CreditCard size={28} />}
      lastUpdated="01/04/2026"
      sections={[
        {
          title: "Thanh toán tiền mặt khi nhận hàng (COD)",
          content: (
            <>
              <p>
                Khi nhân viên giao hàng đến, quý khách kiểm tra sản phẩm và <strong>thanh toán trực tiếp</strong> theo giá trị trên hoá đơn.{" "}
                <span className="text-green-600 font-medium">Không phát sinh bất kỳ chi phí nào khác.</span>
              </p>
              <div className="bg-green-50 rounded-xl p-4 mt-2 flex items-start gap-3">
                <span className="text-2xl">&#128230;</span>
                <div>
                  <p className="font-semibold text-gray-800">Nhận hàng - Kiểm tra - Thanh toán</p>
                  <p className="text-sm text-gray-600">Quy trình đơn giản, an tâm mua sắm</p>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Thanh toán tại cửa hàng",
          content: (
            <p>
              Quý khách đến trực tiếp showroom tại{" "}
              <strong>{app.address}</strong> để xem hàng, mua sắm và thanh toán bằng <strong>tiền mặt hoặc chuyển khoản</strong> tại chỗ.
            </p>
          ),
        },
        {
          title: "Chuyển khoản ngân hàng",
          content: (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <p className="font-semibold text-gray-800 mb-4">Thông tin tài khoản:</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Ngân hàng</span>
                  <span className="font-bold text-gray-800">{BANK_INFO.bank}</span>
                </div>
                <hr className="border-blue-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Số tài khoản</span>
                  <span className="font-bold text-blue-1 text-lg tracking-wider">{BANK_INFO.accountNumber}</span>
                </div>
                <hr className="border-blue-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Chủ tài khoản</span>
                  <span className="font-bold text-gray-800 text-right">{BANK_INFO.accountHolder}</span>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Nội dung chuyển khoản</p>
                <p className="font-mono font-bold text-gray-800">[Mã đơn hàng] - [Tên khách hàng]</p>
              </div>
            </div>
          ),
        },
        {
          title: "Hỗ trợ thanh toán",
          content: (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-amber-800">
                Nếu quý khách gặp khó khăn trong quá trình thanh toán, vui lòng liên hệ{" "}
                <a href={`tel:${app.phones[0]}`} className="font-bold text-blue-1 hover:underline">
                  hotline {app.phones[0]}
                </a>{" "}
                để được hỗ trợ ngay.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
