import { app } from "@/config/constants";
import { getCategories } from "@/lib/api/services/categoryService";
import { MapPin, Phone, Mail, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = async () => {
  const categories = await getCategories().catch(() => []);

  const policies = [
    { href: "/chinh-sach-doi-tra", label: "Chính sách đổi trả" },
    { href: "/chinh-sach-kiem-hang", label: "Chính sách kiểm hàng" },
    { href: "/hinh-thuc-thanh-toan", label: "Hình thức thanh toán" },
    { href: "/chinh-sach-van-chuyen", label: "Chính sách vận chuyển" },
  ];

  const socials = [
    {
      href: app.facebook,
      icon: "/assets/icons/facebook_icon.png",
      label: "Facebook",
    },
    {
      href: app.zalo,
      icon: "/assets/icons/zalo.webp",
      label: "Zalo",
      rounded: true,
    },
    {
      href: app.shoppee,
      icon: "/assets/icons/shopee_icon.png",
      label: "Shopee",
    },
    {
      href: app.tiktok,
      icon: "/assets/icons/tiktok_icon.png",
      label: "TikTok",
      rounded: true,
    },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Top wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#0f2e2c] pointer-events-none" />

      {/* Main footer */}
      <div className="bg-gradient-to-b from-[#0f2e2c] via-[#122e2b] to-[#0a1f1e] pt-16 pb-6 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-[10%] w-64 h-64 rounded-full bg-[#1a7a74]/5 blur-[80px]" />
        <div className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-[#31c9c0]/4 blur-[60px]" />

        <div className="container">
          {/* Top section — logo + social */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/10">
            <div>
              <Link href="/">
                <Image
                  src={app.shopLogo}
                  alt="Logo"
                  width={140}
                  height={50}
                  className="h-[44px] w-auto object-contain"
                />
              </Link>
              <p className="text-white/50 text-sm mt-3">
                Chuyên cung cấp giấy in hóa đơn, tem decal nhiệt, máy in đơn
                hàng chất lượng cao.
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1a7a74] hover:border-[#1a7a74] hover:scale-110 transition-all duration-300"
                >
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={22}
                    height={22}
                    className={`object-cover ${s.rounded ? "rounded-full" : ""}`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 lg:gap-12 mb-12">
            {/* Contact */}
            <div>
              <h3 className="text-sm font-[700] text-[#31c9c0] uppercase tracking-[2px] mb-5">
                Liên hệ
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a7a74]/20 transition-colors duration-300">
                    <MapPin size={15} className="text-[#31c9c0]" />
                  </div>
                  <span className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {app.address}
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a7a74]/20 transition-colors duration-300">
                    <Phone size={15} className="text-[#31c9c0]" />
                  </div>
                  <a
                    href={`tel:${app.phones?.[0]}`}
                    className="text-sm text-white/60 hover:text-[#31c9c0] transition-colors duration-300"
                  >
                    {app.phones?.[0]}
                    {app.phones?.[1] ? ` - ${app.phones[1]}` : ""}
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a7a74]/20 transition-colors duration-300">
                    <Mail size={15} className="text-[#31c9c0]" />
                  </div>
                  <a
                    href={`mailto:${app.email}`}
                    className="text-sm text-white/60 hover:text-[#31c9c0] transition-colors duration-300"
                  >
                    {app.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-sm font-[700] text-[#31c9c0] uppercase tracking-[2px] mb-5">
                Chính sách
              </h3>
              <ul className="space-y-3">
                {policies.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                    >
                      <ChevronRight
                        size={14}
                        className="text-white/30 group-hover:text-[#31c9c0] transition-colors duration-300"
                      />
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-[700] text-[#31c9c0] uppercase tracking-[2px] mb-5">
                Sản phẩm
              </h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/danh-muc/${cat.slug}`}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                    >
                      <ChevronRight
                        size={14}
                        className="text-white/30 group-hover:text-[#31c9c0] transition-colors duration-300"
                      />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-sm font-[700] text-[#31c9c0] uppercase tracking-[2px] mb-5">
                Địa điểm
              </h3>
              <div className="w-full h-[200px] rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src={app.mapEmbed}
                  title="Bản đồ cửa hàng Halo"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(app.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-[#31c9c0] mt-2 transition-colors duration-300"
              >
                Mở Google Maps <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              &copy; {new Date().getFullYear()}
              <Image src={app.shopLogo} alt={app.shopName} width={50} height={18} className="h-[14px] w-auto inline-block" />
              . All rights reserved.
            </span>
            <p className="text-xs text-white/30">
              Thiết kế bởi <span className="text-[#31c9c0]/60">Mr.SonLe</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
