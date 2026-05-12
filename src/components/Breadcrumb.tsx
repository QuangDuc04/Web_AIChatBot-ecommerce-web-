"use client";

import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

interface BreadcrumbItem {
  href: string;
  label: string;
  isLast: boolean;
}

export default function Breadcrumb(props: { crumbs: BreadcrumbItem[] }) {
  const { crumbs } = props;

  return (
    <nav className="flex items-center sm:text-base text-sm text-gray-600 gap-2 py-4 overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: 'none' }}>
      <Link
        href="/"
        className="flex items-center gap-2 hover:text-primary transition-colors opacity-[0.7] hover:opacity-100 transition"
      >
        <House size={20} className="text-blue-1" /> Trang chủ
      </Link>

      {crumbs.map(({ href, label, isLast }) => (
        <div key={href} className="flex items-center gap-2 flex-shrink-0">
          <ChevronRight size={20} />{" "}
          {isLast ? (
            <span className="font-semibold text-gray-800">
              {label}
            </span>
          ) : (
            <Link
              href={href}
              className="hover:text-primary transition-colors"
            >
              {label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
