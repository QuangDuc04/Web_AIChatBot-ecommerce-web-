"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Share2,
  Facebook,
  Link as LinkIcon,
  Check,
  MessageCircle,
  X,
} from "lucide-react";

interface IShareButton {
  title?: string;
  className?: string;
}

const ShareButton = ({ title, className }: IShareButton) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const url = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const shareItems = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      bg: "bg-[#1877F2]/10",
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        ),
    },
    {
      name: "Zalo",
      icon: MessageCircle,
      color: "#0068FF",
      bg: "bg-[#0068FF]/10",
      onClick: () =>
        window.open(
          `https://zalo.me/share?url=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        ),
    },
    {
      name: "X (Twitter)",
      icon: X,
      color: "#000000",
      bg: "bg-gray-100",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`,
          "_blank",
          "width=600,height=400"
        ),
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#1a7a74] transition-colors duration-300"
      >
        <Share2 size={15} /> Chia sẻ
      </button>

      {/* Dropdown */}
      <div
        className={`absolute bottom-full right-0 mb-2 w-52 bg-white rounded-xl border border-gray-100 overflow-hidden z-50 transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
            : "opacity-0 scale-95 translate-y-1 pointer-events-none"
        }`}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
            Chia sẻ qua
          </p>
        </div>

        <div className="py-1">
          {shareItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <span className="text-[14px] font-medium text-gray-700">
                {item.name}
              </span>
            </button>
          ))}

          {/* Copy link */}
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a7a74]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <LinkIcon size={16} className="text-[#1a7a74]" />
              )}
            </div>
            <span className="text-[14px] font-medium text-gray-700">
              {copied ? "Đã sao chép!" : "Sao chép liên kết"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareButton;
