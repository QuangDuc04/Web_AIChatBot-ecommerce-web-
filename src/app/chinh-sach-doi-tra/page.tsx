import PolicyPage from "@/components/PolicyPage";
import { RefreshCcw } from "lucide-react";
import { app } from "@/config/constants";

export default function ReturnPolicy() {
  return (
    <PolicyPage
      title="Chính sách đổi trả"
      description={`${app.shopName} cam kết mang đến sản phẩm chất lượng và trải nghiệm mua sắm hài lòng. Chính sách đổi trả rõ ràng, minh bạch, bảo vệ quyền lợi khách hàng.`}
      icon={<RefreshCcw size={28} />}
      lastUpdated="01/04/2026"
      sections={[
        {
          title: "Điều kiện áp dụng đổi/trả",
          content: (
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>Sản phẩm còn nguyên tem, nhãn mác, chưa sử dụng và còn nguyên trạng thái khi nhận.</li>
              <li>Có kèm <strong>video khi khui hàng</strong> để làm bằng chứng đối chiếu.</li>
              <li>Không có dấu hiệu đã qua sử dụng hoặc hư hỏng do người dùng gây ra.</li>
              <li>Đổi/trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng.</li>
              <li>Cần hoá đơn mua hàng hoặc phiếu giao nhận để xác nhận.</li>
            </ul>
          ),
        },
        {
          title: "Các trường hợp được đổi trả",
          content: (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">&#10003;</span>
                <div>
                  <p className="font-semibold text-gray-800">Sản phẩm lỗi do nhà sản xuất</p>
                  <p className="text-sm text-gray-600">Rò rỉ, hỏng hóc, bung chỉ, in lỗi...</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">&#10003;</span>
                <div>
                  <p className="font-semibold text-gray-800">Giao nhầm sản phẩm</p>
                  <p className="text-sm text-gray-600">Sai size, sai mẫu, sai chủng loại so với đơn hàng.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">&#8634;</span>
                <div>
                  <p className="font-semibold text-gray-800">Khách đặt sai kích cỡ</p>
                  <p className="text-sm text-gray-600">Hỗ trợ đổi size/mẫu nếu còn hàng tồn kho.</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Quy trình đổi trả",
          content: (
            <div className="space-y-3">
              {[
                { step: 1, text: `Liên hệ hotline ${app.phones[0]} hoặc email ${app.email}` },
                { step: 2, text: "Cung cấp thông tin đơn hàng và lý do đổi/trả" },
                { step: 3, text: "Gửi sản phẩm về địa chỉ công ty" },
                { step: 4, text: "Sau khi kiểm tra, công ty tiến hành đổi hoặc hoàn tiền" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-1/10 text-blue-1 font-bold text-sm flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <p className="pt-1">{s.text}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: "Chi phí đổi/trả",
          content: (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="font-semibold text-gray-800 mb-1">Lỗi do nhà sản xuất</p>
                <p className="text-green-700 font-bold">Miễn phí vận chuyển</p>
                <p className="text-xs text-gray-500 mt-1">Công ty chịu toàn bộ chi phí</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-800 mb-1">Khách đặt sai size/mẫu</p>
                <p className="text-gray-700 font-bold">Khách chịu phí ship</p>
                <p className="text-xs text-gray-500 mt-1">Chi phí vận chuyển 2 chiều (nếu có)</p>
              </div>
            </div>
          ),
        },
        {
          title: "Hoàn tiền",
          content: (
            <div className="bg-blue-50 rounded-xl p-4">
              <p>
                Hoàn tiền trong vòng <strong className="text-blue-1">7 - 10 ngày làm việc</strong> qua tài khoản ngân hàng hoặc ví điện tử sau khi xác minh sản phẩm đáp ứng điều kiện đổi trả.
              </p>
            </div>
          ),
        },
        {
          title: "Lưu ý",
          content: (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-amber-800 font-medium">
                Các sản phẩm giảm giá, khuyến mãi, hoặc quà tặng sẽ <strong>không áp dụng</strong> chính sách đổi trả.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
