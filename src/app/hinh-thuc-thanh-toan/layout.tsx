import type { Metadata } from "next";
import { app } from "@/config/constants";

export const metadata: Metadata = {
  title: `Hình thức thanh toán | ${app.shopName}`,
  description:
    "Các hình thức thanh toán tại Giấy In Halo: tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng ACB, thanh toán tại cửa hàng. An toàn, nhanh chóng.",
  icons: "ly-icon.png",
  openGraph: {
    title: `Hình thức thanh toán | ${app.shopName}`,
    description:
      "Thanh toán COD, chuyển khoản ngân hàng, thanh toán tại cửa hàng.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
