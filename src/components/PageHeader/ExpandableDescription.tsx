"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface IExpandableDescription {
  text: string;
  collapsedLines?: number;
}

export default function ExpandableDescription({
  text,
  collapsedLines = 3,
}: IExpandableDescription) {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // Compare actual scrollHeight vs clamped clientHeight
    setNeedsTruncation(el.scrollHeight > el.clientHeight + 2);
  }, [text]);

  return (
    <div className="mt-2 relative">
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{
          maxHeight: expanded ? "500px" : `${collapsedLines * 1.75}rem`,
        }}
      >
        <p
          ref={textRef}
          className="text-[14px] sm:text-[15px] text-gray-500 leading-[1.75] pr-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : collapsedLines,
            WebkitBoxOrient: "vertical",
            overflow: expanded ? "visible" : "hidden",
          }}
        >
          {text}
        </p>
      </div>


      {needsTruncation && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 mt-1 text-[13px] sm:text-[14px] font-semibold text-[#1a7a74] hover:text-[#25998f] transition-colors duration-300 group"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
          <ChevronDown
            size={14}
            className={`transition-transform duration-400 ease-out ${
              expanded ? "rotate-180" : "group-hover:translate-y-0.5"
            }`}
          />
        </button>
      )}
    </div>
  );
}
