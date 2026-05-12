import Image from "next/image";

const data = [
  {
    icon: "/assets/images/why-choose-us/vs1.png",
    title: "Sản phẩm chất lượng cao",
    description:
      "Sản xuất từ nguyên liệu cao cấp, quy trình kiểm soát nghiêm ngặt đảm bảo vượt mong đợi khách hàng.",
    num: "01",
  },
  {
    icon: "/assets/images/why-choose-us/vs2.png",
    title: "Giá cả cạnh tranh",
    description:
      "Chiến lược giá linh hoạt, cam kết mức giá tốt nhất trên thị trường cho mọi khách hàng.",
    num: "02",
  },
  {
    icon: "/assets/images/why-choose-us/vs3.png",
    title: "Vận chuyển nhanh chóng",
    description:
      "Hệ thống logistics hiện đại, đối tác vận chuyển uy tín, giao hàng nhanh và an toàn.",
    num: "03",
  },
  {
    icon: "/assets/images/why-choose-us/vs4.png",
    title: "Chăm sóc khách hàng",
    description:
      "Đội ngũ hỗ trợ chuyên nghiệp, phản hồi nhanh chóng và tận tâm giải quyết mọi vấn đề.",
    num: "04",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="sm:py-16 py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-12">
        <div className="flex items-center justify-center gap-3 mb-2 sm:mb-4">
          <div className="w-6 sm:w-10 h-[3px] bg-[#1a7a74] rounded-full" />
          <span className="text-[11px] sm:text-sm font-[700] text-[#1a7a74] uppercase tracking-[2px]">
            Tại sao chọn chúng tôi
          </span>
          <div className="w-6 sm:w-10 h-[3px] bg-[#1a7a74] rounded-full" />
        </div>
        <h2 className="text-[20px] sm:text-[26px] md:text-[30px] font-[800] text-gray-900">
          Giá trị <span className="text-[#1a7a74]">khác biệt</span> của chúng
          tôi
        </h2>
      </div>

      {/* ── Mobile: horizontal scroll cards ── */}
      <div
        className="flex sm:hidden gap-3 overflow-x-auto pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {data.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[250px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a7a74] to-[#2ba69e] flex items-center justify-center shrink-0 shadow-sm">
                <Image
                  src={item.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              <h3 className="text-[14px] font-bold text-gray-800 leading-tight">
                {item.title}
              </h3>
            </div>
            <p className="px-4 pb-4 text-[11.5px] text-gray-500 leading-relaxed line-clamp-3">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* ── Desktop: unified card layout ── */}
      <div className="hidden sm:block">
        <div
          className="relative rounded-3xl overflow-hidden bg-white border border-gray-100/60"
          style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
        >
          <div className="flex lg:flex-row flex-col-reverse">
            {/* Left: Feature grid */}
            <div className="lg:w-[58%] w-full grid grid-cols-2 relative">
              {/* Cross dividers */}
              <div className="absolute left-1/2 top-6 bottom-6 w-px bg-gray-100/80" />
              <div className="absolute left-6 right-6 top-1/2 h-px bg-gray-100/80" />

              {data.map((item, i) => (
                <div
                  key={i}
                  className="relative p-6 lg:p-8 group cursor-default transition-all duration-500 ease-out hover:bg-gradient-to-br hover:from-[#edf9f8]/50 hover:to-transparent"
                >
                  {/* Soft glow on hover */}
                  <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-[#1a7a74]/0 group-hover:bg-[#1a7a74]/[0.06] blur-2xl transition-all duration-700 ease-out pointer-events-none" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a7a74] to-[#2ba69e] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(26,122,116,0.25)] transition-all duration-500 ease-out">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={26}
                        height={26}
                        className="object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-800 group-hover:text-[#1a7a74] transition-colors duration-500 ease-out mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-2/3 bg-gradient-to-r from-transparent via-[#1a7a74] to-transparent rounded-full transition-all duration-700 ease-out" />
                </div>
              ))}
            </div>

            {/* Right: Image area */}
            <div className="lg:w-[42%] w-full relative overflow-hidden bg-gradient-to-br from-[#edf9f8] to-[#d6f1ef]/40">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#1a7a74]/[0.06]" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#1a7a74]/[0.08]" />

              <div className="relative h-full flex items-center justify-center p-8 lg:p-10">
                <Image
                  src="/assets/images/why-choose-us/ly.jpg"
                  alt="Why choose us"
                  width={530}
                  height={400}
                  className="relative w-full rounded-2xl object-cover"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(26,122,116,0.18), 0 4px 16px rgba(0,0,0,0.06)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
