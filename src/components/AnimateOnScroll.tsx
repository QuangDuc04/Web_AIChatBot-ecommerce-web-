"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type AnimationType =
  | "fade-up"
  | "fade-in"
  | "fade-left"
  | "fade-right"
  | "scale-in";

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  animation?: AnimationType;
  className?: string;
  delay?: number;
}) {
  const ref = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`animate-${animation} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
