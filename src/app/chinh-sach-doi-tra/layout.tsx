import type { Metadata } from "next";
import { app } from "@/config/constants";

export const metadata: Metadata = {
  title: `Chính sách đổi trả | ${app.shopName}`,
  description:
    "Chính sách đổi trả của Giấy In Halo: đổi trả miễn phí trong 7 ngày, hoàn tiền trong 7-10 ngày làm việc. Sản phẩm lỗi do nhà sản xuất được đổi mới 100%.",
  icons: "ly-icon.png",
  openGraph: {
    title: `Chính sách đổi trả | ${app.shopName}`,
    description:
      "Đổi trả miễn phí trong 7 ngày, hoàn tiền trong 7-10 ngày làm việc.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
