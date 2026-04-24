import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dịch vụ In Ấn",
  description:
    "Dịch vụ in ấn chuyên nghiệp - In hóa đơn, tem decal, nhãn dán. Giá tốt, chất lượng cao, giao hàng nhanh.",
  icons: {
    icon: "/assets/logos/logo.png",
  },
};

export default function PrintServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
