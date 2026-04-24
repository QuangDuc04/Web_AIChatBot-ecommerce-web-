import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm - Giấy in, Tem decal, Máy in",
  description:
    "Xem tất cả sản phẩm của Halo: giấy in hóa đơn, tem decal nhiệt, máy in đơn hàng, phần mềm bán hàng. Giá tốt nhất thị trường.",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
