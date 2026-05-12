"use client";

import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  return (
    <nav className="bg-[#f8fffe] border border-[#e0f0ee] rounded-2xl p-5 mb-8">
      <p className="flex items-center gap-2 text-[15px] font-[700] text-gray-800 mb-3">
        <List size={16} className="text-[#1a7a74]" />
        Mục lục
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 14}px` }}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block py-1 text-[14px] transition-colors hover:text-[#1a7a74] ${
                item.level === 2
                  ? "font-[600] text-gray-700"
                  : item.level === 3
                  ? "font-[500] text-gray-500"
                  : "text-gray-400 text-[14px]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
