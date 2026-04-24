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
    default: "Halo - Giấy in hóa đơn, Tem decal nhiệt, Máy in đơn hàng",
    template: "%s | Halo",
  },
  description:
    "Halo - Chuyên cung cấp giấy in hóa đơn, tem decal nhiệt, máy in đơn hàng, phần mềm bán hàng. Giá tốt nhất thị trường, giao hàng nhanh 24/7.",
  keywords: [
    "giấy in hóa đơn",
    "tem decal nhiệt",
    "máy in đơn hàng",
    "phần mềm bán hàng",
    "giấy in nhiệt",
    "tem nhãn",
    "Halo",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Halo - Giấy in hóa đơn, Tem decal nhiệt, Máy in đơn hàng",
    description:
      "Chuyên cung cấp giấy in hóa đơn, tem decal nhiệt, máy in đơn hàng. Giá tốt nhất, giao hàng nhanh 24/7.",
    url: siteUrl,
    siteName: "Halo",
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
    name: "Halo",
    description:
      "Chuyên cung cấp giấy in hóa đơn, tem decal nhiệt, máy in đơn hàng, phần mềm bán hàng.",
    url: siteUrl,
    telephone: "0347.366.345",
    email: "son.lequang97@gmail.com",
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
