"use client";

import type { Product } from "@/types/product";
import { ChevronDown } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const COLLAPSED_HEIGHT = 400;

const ReadMore = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsToggle(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
  }, [content]);

  return (
    <div className="relative">
      {/* Content */}
      <div
        ref={contentRef}
        className="editor-content overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: expanded ? `${contentRef.current?.scrollHeight ?? 9999}px` : `${COLLAPSED_HEIGHT}px` }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Fade overlay + toggle */}
      {needsToggle && (
        <div
          className={`relative transition-all duration-500 ${
            expanded ? "mt-2" : "-mt-16 pt-16"
          }`}
        >
          {/* Gradient fade — only when collapsed */}
          {!expanded && (
            <div
              className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
              }}
            />
          )}

          {/* Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="relative z-[1] w-full flex items-center justify-center gap-2 py-3 text-[14px] font-[600] text-[#1a7a74] hover:text-[#15635e] cursor-pointer transition-colors group"
          >
            <span>{expanded ? "Thu gọn" : "Xem thêm"}</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

const DescriptionProduct = ({ product }: { product: Product }) => (
  <ReadMore content={product.description || ""} />
);
export default DescriptionProduct;
