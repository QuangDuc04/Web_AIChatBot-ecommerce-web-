"use client";

import { useState, useEffect, useCallback } from "react";

interface IFlashSaleCountdown {
  endDate: string | Date;
  onExpired?: () => void;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(end: Date): TimeLeft {
  const diff = Math.max(0, end.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const FlashSaleCountdown = ({ endDate, onExpired }: IFlashSaleCountdown) => {
  const end = new Date(endDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(end));
  const [expired, setExpired] = useState(false);

  const tick = useCallback(() => {
    const t = calcTimeLeft(end);
    setTimeLeft(t);
    if (t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
      setExpired(true);
      onExpired?.();
    }
  }, [end, onExpired]);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  if (expired) return null;

  const { hours, minutes, seconds } = timeLeft;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white text-sm font-medium">Kết thúc sau:</span>
      {[
        { value: hours, label: "giờ" },
        { value: minutes, label: "phút" },
        { value: seconds, label: "giây" },
      ].map(({ value, label }, i) => (
        <span key={label} className="flex items-center gap-1">
          <span className="bg-white text-red-1 font-bold text-base px-2 py-0.5 rounded-[4px] min-w-[2rem] text-center tabular-nums">
            {pad(value)}
          </span>
          <span className="text-white/80 text-xs">{label}</span>
          {i < 2 && <span className="text-white font-bold">:</span>}
        </span>
      ))}
    </div>
  );
};

export default FlashSaleCountdown;
