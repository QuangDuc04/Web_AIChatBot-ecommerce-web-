import PolicyPage from "@/components/PolicyPage";
import { ClipboardCheck } from "lucide-react";
import { app } from "@/config/constants";

export default function InspectionPolicy() {
  return (
    <PolicyPage
      title="Chính sách kiểm hàng"
      description="Hướng dẫn kiểm tra hàng hóa khi nhận để đảm bảo sản phẩm đúng với đơn đặt hàng của quý khách."
      icon={<ClipboardCheck size={28} />}
      lastUpdated="01/04/2026"
      sections={[
        {
          title: "Kiểm hàng là gì?",
          content: (
            <p>
              Kiểm hàng là việc <strong>kiểm tra và đối chiếu</strong> các sản phẩm nhận được trong kiện hàng với các sản phẩm trong đơn hàng mà quý khách đã đặt tại{" "}
              <strong className="text-blue-1">Giấy In Halo</strong>
              .
            </p>
          ),
        },
        {
          title: "Thời điểm kiểm hàng",
          content: (
            <>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>Đồng kiểm với nhân viên giao hàng</strong> tại thời điểm nhận hàng (hoặc trong vòng 30 phút kể từ khi nhận).
                </li>
                <li>
                  Sau khi nhận hàng, nếu phát hiện sai lệch, liên hệ bộ phận CSKH để được hỗ trợ đổi trả.
                </li>
              </ul>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-3">
                <p className="text-red-700 text-sm font-semibold">
                  Quan trọng: Quý khách vui lòng quay video lúc mở thùng hàng để đối chiếu khi cần thiết.
                </p>
              </div>
            </>
          ),
        },
        {
          title: "Phạm vi kiểm tra hàng hóa",
          content: (
            <>
              <p>Quý khách được kiểm đếm số lượng, đối chiếu và so sánh sản phẩm nhận với sản phẩm đã đặt theo các tiêu chí:</p>
              <ul className="list-disc list-outside ml-5 space-y-2 mt-2">
                <li>
                  <strong>Thuộc tính cơ bản:</strong> tên hàng, số lượng, thông tin khách hàng trên đơn.
                </li>
                <li>
                  <strong>Mẫu mã:</strong> đối chiếu với ảnh đại diện sản phẩm trên website.
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-3">
                <p className="font-semibold text-amber-800 text-sm mb-2">Không được:</p>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-amber-700">
                  <li>Bóc, mở các hộp sản phẩm còn niêm phong</li>
                  <li>Cào, làm rách mã QR, tem chống giả, tem đảm bảo</li>
                  <li>Sử dụng sản phẩm trong quá trình kiểm tra</li>
                </ul>
              </div>
            </>
          ),
        },
        {
          title: "Xử lý khi hàng không đúng đơn đặt",
          content: (
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                Liên hệ ngay <strong>hotline {app.phones[0]}</strong> để được hỗ trợ.
              </li>
              <li>
                Trường hợp đồng kiểm: quý khách có thể <strong>từ chối nhận hàng và không cần thanh toán</strong>.
              </li>
              <li>
                Nếu đã thanh toán, tiền sẽ được <strong>hoàn lại trong thời gian sớm nhất</strong>.
              </li>
            </ul>
          ),
        },
        {
          title: "Kênh tiếp nhận khiếu nại",
          content: (
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href={`tel:${app.phones[0]}`}
                className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-100 transition-colors"
              >
                <span className="text-2xl">&#128222;</span>
                <div>
                  <p className="text-xs text-gray-500">Hotline</p>
                  <p className="font-bold text-gray-800">{app.phones[0]}</p>
                </div>
              </a>
              <a
                href={`mailto:${app.email}`}
                className="bg-green-50 rounded-xl p-4 flex items-center gap-3 hover:bg-green-100 transition-colors"
              >
                <span className="text-2xl">&#9993;</span>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-bold text-gray-800">{app.email}</p>
                </div>
              </a>
            </div>
          ),
        },
      ]}
    />
  );
}
