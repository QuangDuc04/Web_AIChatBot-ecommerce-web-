import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dang-nhap", "/dang-ky", "/tai-khoan", "/don-hang", "/thanh-toan"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
