import type { Metadata } from "next";
import { app } from "@/config/constants";

export const metadata: Metadata = {
  title: `Chính sách kiểm hàng | ${app.shopName}`,
  description:
    "Chính sách kiểm hàng của Giấy In Halo: đồng kiểm tại thời điểm nhận hàng, hỗ trợ đổi trả khi phát hiện sai lệch. Quay video khi mở hàng để đảm bảo quyền lợi.",
  icons: "ly-icon.png",
  openGraph: {
    title: `Chính sách kiểm hàng | ${app.shopName}`,
    description:
      "Đồng kiểm tại thời điểm nhận hàng, hỗ trợ đổi trả khi phát hiện sai lệch.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
