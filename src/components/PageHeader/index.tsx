import React from "react";
import ExpandableDescription from "./ExpandableDescription";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string | null;
  badge?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  badge,
  children,
}: PageHeaderProps) {
  return (
    <div className="relative mt-2 mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          {badge && (
            <span className="inline-block text-[13px] font-[700] text-[#1a7a74] uppercase tracking-[2px] mb-2">
              {badge}
            </span>
          )}
          <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-[22px] sm:text-[32px] font-[800] text-gray-900 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[14px] sm:text-[17px] font-semibold text-[#1a7a74]">
                {subtitle}
              </span>
            )}
          </div>
          {description && <ExpandableDescription text={description} />}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
      <div className="mt-4 h-[3px] bg-gradient-to-r from-[#1a7a74] via-[#31c9c0] to-transparent rounded-full" />
    </div>
  );
}
