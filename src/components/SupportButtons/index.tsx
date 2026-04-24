import { app } from "@/config/constants";
import { PhoneCall } from "lucide-react";

export default function SupportButtons() {
  return (
    <div className="fixed bottom-[18px] right-[18px] flex flex-col items-center gap-3 z-[100]">
      {/* Phone button with pulse ring */}
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-[#1a7a74] animate-ping opacity-20" />
        <span className="absolute inset-[-4px] rounded-full border-2 border-[#1a7a74]/30 animate-[pulse_2s_ease-in-out_infinite]" />
        <a
          href={`tel:+${app.phones?.[0]}`}
          aria-label="Gọi hotline"
          className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#1a7a74] to-[#25998f] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(26,122,116,0.4)] hover:shadow-[0_6px_30px_rgba(26,122,116,0.5)] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <PhoneCall size={18} />
        </a>
      </div>
    </div>
  );
}
