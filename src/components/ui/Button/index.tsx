import React from "react";

type ButtonVariant = "primary" | "outline" | "white";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 sm:px-5 py-1.5 sm:py-2 text-[12px] sm:text-sm",
  md: "px-4 sm:px-8 py-2 sm:py-3 text-[13px] sm:text-[15px]",
  lg: "px-9 sm:px-11 py-3 sm:py-3.5 text-[15px] sm:text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        btn group relative inline-flex items-center justify-center gap-2
        font-[700] rounded-full overflow-hidden cursor-pointer
        tracking-wide uppercase
        transition-all duration-500 ease-out
        hover:-translate-y-1
        active:translate-y-0 active:scale-[0.97]
        disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0
        btn-${variant}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {/* Animated background layer */}
      <span className="btn-bg absolute inset-0 rounded-full pointer-events-none" />

      {/* Shimmer sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none">
        <span className="block w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </span>

      {/* Glow ring on hover */}
      <span className="btn-glow absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <span className="relative z-[1] flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export { Button };
export type { ButtonVariant, ButtonSize };
