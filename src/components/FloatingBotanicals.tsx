"use client";

import { useMemo, useEffect, useRef, useCallback, useState } from "react";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  dur: number;
  delay: number;
  path: number;
  opacity: number;
  glow: number;
  color: "teal" | "cyan";
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      size: 4 + Math.random() * 22,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dur: 12 + Math.random() * 20,
      delay: Math.random() * -30,
      path: Math.floor(Math.random() * 6) + 1,
      opacity: 0.15 + Math.random() * 0.25,
      glow: 8 + Math.random() * 20,
      color: Math.random() > 0.45 ? "teal" : "cyan",
    });
  }
  return particles;
}

const COLORS = {
  teal: { bg: "26,122,116", shadow: "26,122,116" },
  cyan: { bg: "49,201,192", shadow: "49,201,192" },
};

const REPEL_RADIUS = 180;
const REPEL_STRENGTH = 60;

export default function FloatingBotanicals() {
  const [mounted, setMounted] = useState(false);
  const particles = useMemo(() => generateParticles(15), []);

  useEffect(() => { setMounted(true); }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const refs = particleRefs.current;

    // Batch all DOM reads first to avoid layout thrashing
    const rects: (DOMRect | null)[] = [];
    for (let i = 0; i < refs.length; i++) {
      const el = refs[i];
      rects[i] = el ? el.getBoundingClientRect() : null;
    }

    // Then batch all DOM writes
    for (let i = 0; i < refs.length; i++) {
      const el = refs[i];
      const rect = rects[i];
      if (!el || !rect) continue;

      const px = rect.left + rect.width / 2;
      const py = rect.top + rect.height / 2;

      const dx = px - mx;
      const dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        const angle = Math.atan2(dy, dx);
        const offsetX = Math.cos(angle) * force;
        const offsetY = Math.sin(angle) * force;
        el.style.setProperty("--repel-x", `${offsetX}px`);
        el.style.setProperty("--repel-y", `${offsetY}px`);
        const scale = 1 + (1 - dist / REPEL_RADIUS) * 0.3;
        el.style.setProperty("--repel-scale", `${scale}`);
      } else {
        el.style.setProperty("--repel-x", "0px");
        el.style.setProperty("--repel-y", "0px");
        el.style.setProperty("--repel-scale", "1");
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {/* Gradient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />

      {/* Dynamic particles — only render client-side to avoid hydration mismatch */}
      {mounted && particles.map((p, i) => {
        const c = COLORS[p.color];
        return (
          <div
            key={p.id}
            ref={(el) => { particleRefs.current[i] = el; }}
            className={`particle particle-path-${p.path}`}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `rgba(${c.bg},${p.opacity + 0.1})`,
              boxShadow: `0 0 ${p.glow}px ${p.glow * 0.6}px rgba(${c.shadow},${p.opacity * 0.5})`,
              animationDuration: `${p.dur}s, ${2 + Math.random() * 4}s`,
              animationDelay: `${p.delay}s, ${p.delay * 0.5}s`,
              // CSS vars for repel — applied via translate in CSS
              "--repel-x": "0px",
              "--repel-y": "0px",
              "--repel-scale": "1",
            } as React.CSSProperties}
          />
        );
      })}

      {/* Floating rings */}
      <div className="ring-outline ring-1" />
      <div className="ring-outline ring-2" />
      <div className="ring-outline ring-3" />
      <div className="ring-outline ring-4" />
    </div>
  );
}
