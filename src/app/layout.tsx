import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonScrollOnTop from "@/components/ButtonScrollOnTop";
import Providers from "@/components/Providers";

import "./globals.css";
import "./app.scss";
import "./fonts.css";
import SupportButtons from "@/components/SupportButtons";
import ChatBox from "@/components/ChatBox";
import FloatingBotanicals from "@/components/FloatingBotanicals";
import BackgroundMusic from "@/components/BackgroundMusic";
import ConsultationWidget from "@/components/ConsultationWidget";

const siteUrl = "https://natro.vn";

export const metadata: Metadata = {
  title: {
    default: "Duc Store",
    template: "%s | Duc",
  },
  description:
    "Duc - Chuyên cung cấp thiết bị điện tử, điện thoại,... Giá tốt nhất thị trường, giao hàng nhanh 24/7.",
  keywords: [
    "giấy in hóa đơn",
    "tem decal nhiệt",
    "máy in đơn hàng",
    "phần mềm bán hàng",
    "giấy in nhiệt",
    "tem nhãn",
    "Halo",
    "Duc",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Duc Store",
    description:
      "Chuyên cung cấp thiết bị điện tử, điện thoại,... Giá tốt nhất, giao hàng nhanh 24/7.",
    url: siteUrl,
    siteName: "Duc",
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/assets/logos/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Duc",
    description:
      "Chuyên cung cấp thiết bị điện tử, điện thoại,... Giá tốt nhất, giao hàng nhanh 24/7.",
    url: siteUrl,
    telephone: "0353.643.396",
    email: "lequangduc3275@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Khu phố Chiêu Liêu, Phường Tân Đông Hiệp",
      addressLocality: "Dĩ An",
      addressRegion: "Bình Dương",
      addressCountry: "VN",
    },
  };

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <FloatingBotanicals />
        <Providers>
          <Header />
          {children}
          <Footer />
          <ButtonScrollOnTop />
          <SupportButtons />
          {/* <ChatBox /> */}
          <ConsultationWidget />
          <BackgroundMusic />
        </Providers>
      </body>
    </html>
  );
}
