import PolicyPage from "@/components/PolicyPage";
import { Truck } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <PolicyPage
      title="Chính sách vận chuyển"
      description="Thông tin chi tiết về phương thức giao hàng, thời gian vận chuyển và chính sách xử lý khi có sự cố."
      icon={<Truck size={28} />}
      lastUpdated="01/04/2026"
      sections={[
        {
          title: "Phương thức giao hàng",
          content: (
            <>
              <p>Chúng tôi hỗ trợ các phương thức giao hàng sau:</p>
              <ul className="list-disc list-outside ml-5 space-y-2 mt-2">
                <li>
                  <strong>Mua trực tiếp tại cửa hàng</strong> — Quý khách có thể đến xem và nhận hàng ngay tại showroom.
                </li>
                <li>
                  <strong>Giao hàng qua đối tác vận chuyển</strong> — Áp dụng cho toàn bộ 63 tỉnh thành trên toàn quốc.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Thời gian giao hàng dự kiến",
          content: (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800 mb-1">Nội thành Hà Nội, TP.HCM</p>
                  <p className="text-blue-1 font-bold text-lg">2 - 3 ngày</p>
                  <p className="text-xs text-gray-500 mt-1">Ngày làm việc, không tính Lễ/Tết</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800 mb-1">Các khu vực khác</p>
                  <p className="text-teal-600 font-bold text-lg">3 - 5 ngày</p>
                  <p className="text-xs text-gray-500 mt-1">Ngày làm việc, không tính Lễ/Tết</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-3">
                <p className="font-semibold text-amber-800 text-sm mb-2">Các trường hợp có thể ảnh hưởng thời gian giao hàng:</p>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-amber-700">
                  <li>Không liên lạc được với khách hàng qua điện thoại</li>
                  <li>Địa chỉ giao hàng không chính xác</li>
                  <li>Số lượng đơn hàng tăng đột biến</li>
                  <li>Đối tác giao hàng gặp sự cố vận chuyển</li>
                </ul>
              </div>
            </>
          ),
        },
        {
          title: "Giao hàng số lượng lớn",
          content: (
            <p>
              Đối với khách hàng mua số lượng lớn hoặc khách buôn, chúng tôi sẽ sử dụng dịch vụ giao nhận chuyên nghiệp của công ty vận chuyển.{" "}
              <strong>Phí vận chuyển sẽ được tính theo thoả thuận</strong> và báo giá cụ thể trước khi giao.
            </p>
          ),
        },
        {
          title: "Trách nhiệm trong quá trình vận chuyển",
          content: (
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                Đơn vị vận chuyển chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc{" "}
                <strong>&quot;nguyên đai, nguyên kiện&quot;</strong>.
              </li>
              <li>Trên bao bì có đầy đủ thông tin: tên, địa chỉ, số điện thoại người nhận.</li>
              <li>
                <strong>Giấy In Halo</strong> gửi kèm hóa đơn trong mỗi kiện hàng để đảm bảo tính minh bạch.
              </li>
            </ul>
          ),
        },
        {
          title: "Xử lý hàng hư hỏng do vận chuyển",
          content: (
            <>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>Hàng do cửa hàng vận chuyển:</strong> Chúng tôi chịu trách nhiệm 100% và đổi/trả miễn phí.
                </li>
                <li>
                  <strong>Hàng do bên thứ 3 vận chuyển:</strong> Cửa hàng sẽ làm việc với đối tác vận chuyển để giải quyết quyền lợi cho khách hàng.
                </li>
              </ul>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-3">
                <p className="text-red-700 text-sm font-medium">
                  <strong>Lưu ý:</strong> Trường hợp phát sinh chậm trễ trong giao hàng, chúng tôi sẽ thông báo kịp thời để quý khách lựa chọn giữa việc huỷ hoặc tiếp tục nhận hàng.
                </p>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
