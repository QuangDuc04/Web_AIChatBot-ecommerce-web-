import type { Metadata } from "next";
import { app } from "@/config/constants";

export const metadata: Metadata = {
  title: `Chính sách vận chuyển | ${app.shopName}`,
  description:
    "Chính sách vận chuyển của Giấy In Halo: thời gian giao hàng 2-5 ngày, giao toàn quốc, đảm bảo nguyên đai nguyên kiện. Miễn phí vận chuyển đơn hàng lớn.",
  icons: "ly-icon.png",
  openGraph: {
    title: `Chính sách vận chuyển | ${app.shopName}`,
    description:
      "Thời gian giao hàng 2-5 ngày, giao toàn quốc, đảm bảo nguyên đai nguyên kiện.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
