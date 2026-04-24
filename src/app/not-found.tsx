import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-6xl font-bold text-blue-1 mb-4">404</p>
      <h2 className="text-2xl font-bold text-main mb-2">Không tìm thấy trang</h2>
      <p className="text-gray-500 mb-6">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link href="/">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  );
}
