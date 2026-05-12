"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, Settings, Check } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import {
  getNotifications,
  getNotificationSettings,
  updateNotificationSettings,
} from "@/lib/api/services/notificationService";
import type { Notification, NotificationSettings } from "@/types/notification";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TYPE_LABELS: Record<string, string> = {
  order_update: "Đơn hàng",
  promotion: "Khuyến mãi",
  system: "Hệ thống",
  review_reply: "Đánh giá",
  low_stock: "Tồn kho",
  new_message: "Tin nhắn",
};

const TYPE_COLORS: Record<string, string> = {
  order_update: "bg-blue-100 text-blue-700",
  promotion: "bg-orange-100 text-orange-700",
  system: "bg-gray-100 text-gray-700",
  review_reply: "bg-yellow-100 text-yellow-700",
  low_stock: "bg-red-100 text-red-600",
  new_message: "bg-green-100 text-green-700",
};

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(date).toLocaleDateString("vi-VN");
}

// ---------------------------------------------------------------------------
// Settings panel
// ---------------------------------------------------------------------------
function SettingsPanel() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getNotificationSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (key: keyof Omit<NotificationSettings, "id" | "userId" | "updatedAt">) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key as keyof NotificationSettings] };
    setSettings(updated as NotificationSettings);
    setSaving(true);
    try {
      const saved = await updateNotificationSettings({ [key]: !settings[key as keyof NotificationSettings] });
      setSettings(saved);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-4 text-sm text-gray-400">Đang tải cài đặt...</div>;
  if (!settings) return null;

  const rows: { key: keyof NotificationSettings; label: string; desc: string }[] = [
    { key: "emailNotifications", label: "Email thông báo", desc: "Nhận thông báo qua email" },
    { key: "orderUpdates", label: "Cập nhật đơn hàng", desc: "Thông báo khi đơn hàng thay đổi trạng thái" },
    { key: "promotions", label: "Khuyến mãi", desc: "Thông báo về ưu đãi và chương trình khuyến mãi" },
    { key: "newMessages", label: "Tin nhắn mới", desc: "Thông báo khi có tin nhắn từ hỗ trợ" },
  ];

  return (
    <div className="border border-gray-200 rounded-[8px] overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <p className="font-semibold text-sm text-main flex items-center gap-2">
          <Settings size={15} />
          Cài đặt thông báo
        </p>
        {saved && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <Check size={12} /> Đã lưu
          </span>
        )}
        {saving && <span className="text-xs text-gray-400">Đang lưu...</span>}
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-main">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key as keyof Omit<NotificationSettings, "id" | "userId" | "updatedAt">)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                settings[key as keyof NotificationSettings]
                  ? "bg-blue-main"
                  : "bg-gray-300"
              }`}
              role="switch"
              aria-checked={!!settings[key as keyof NotificationSettings]}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition duration-200 ${
                  settings[key as keyof NotificationSettings] ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function NotificationsPage() {
  const { notifications: ctxNotifications, unreadCount, markRead, markAllRead } = useNotifications();

  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"list" | "settings">("list");

  const loadPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getNotifications(p, 15);
      setAllNotifications(res?.items ?? []);
      setTotalPages(res?.totalPages ?? 1);
      setPage(p);
    } catch {
      setAllNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // Sync new real-time notifications from context into the list
  useEffect(() => {
    if (page === 1 && ctxNotifications.length > 0) {
      setAllNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const newOnes = ctxNotifications.filter((n) => !existingIds.has(n.id));
        return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
      });
    }
  }, [ctxNotifications, page]);

  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      await markRead(n.id);
      setAllNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x))
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-2 border-blue-1 rounded-[8px] overflow-hidden">
        <div className="bg-blue-1 px-4 py-3 flex items-center justify-between">
          <p className="text-white font-bold flex items-center gap-2">
            <Bell size={16} />
            Thông báo
            {unreadCount > 0 && (
              <span className="bg-white text-blue-main text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </p>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  markAllRead();
                  setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                }}
                className="text-white/80 hover:text-white text-xs underline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(["list", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-blue-main text-blue-main"
                  : "text-gray-500 hover:text-main"
              }`}
            >
              {t === "list" ? "Tất cả thông báo" : "Cài đặt"}
            </button>
          ))}
        </div>
      </div>

      {tab === "settings" ? (
        <SettingsPanel />
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-1 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Bell size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-[8px] overflow-hidden divide-y divide-gray-100">
              {allNotifications.map((n) => {
                const item = n.url ? (
                  <Link
                    key={n.id}
                    href={n.url}
                    onClick={() => handleClick(n)}
                    className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors ${
                      !n.isRead ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <NotificationContent n={n} />
                  </Link>
                ) : (
                  <div
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`flex gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !n.isRead ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <NotificationContent n={n} />
                  </div>
                );
                return item;
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {page > 1 && (
                <button
                  onClick={() => loadPage(page - 1)}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:border-blue-1 hover:text-blue-1"
                >
                  &laquo;
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => loadPage(p)}
                  className={`w-8 h-8 text-sm rounded border transition-colors ${
                    p === page
                      ? "bg-blue-1 text-white border-blue-1"
                      : "border-gray-300 hover:border-blue-1 hover:text-blue-1"
                  }`}
                >
                  {p}
                </button>
              ))}
              {page < totalPages && (
                <button
                  onClick={() => loadPage(page + 1)}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:border-blue-1 hover:text-blue-1"
                >
                  &raquo;
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NotificationContent({ n }: { n: Notification }) {
  return (
    <>
      {/* Dot indicator */}
      <div className="mt-1.5 shrink-0">
        <div
          className={`w-2 h-2 rounded-full ${n.isRead ? "bg-transparent" : "bg-blue-main"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${n.isRead ? "text-gray-700" : "font-semibold text-main"}`}>
            {n.title}
          </p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
              TYPE_COLORS[n.type] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {TYPE_LABELS[n.type] ?? n.type}
          </span>
        </div>
        <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
      </div>
    </>
  );
}
