"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-main mb-2">Đã có lỗi xảy ra</h2>
      <p className="text-gray-500 mb-6">Vui lòng thử lại sau.</p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
