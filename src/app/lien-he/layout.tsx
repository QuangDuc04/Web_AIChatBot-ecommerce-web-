import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ Halo - Tư vấn & Hỗ trợ",
  description:
    "Liên hệ Halo để được tư vấn và hỗ trợ về giấy in hóa đơn, tem decal nhiệt, máy in đơn hàng. Hotline: 0347.366.345",
};

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
