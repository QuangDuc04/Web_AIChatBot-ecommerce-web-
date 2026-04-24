"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "@/lib/api/services/notificationService";
import type { Notification } from "@/types/notification";

interface INotificationContext {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<INotificationContext | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getNotifications(1, 20);
      setNotifications(res.items);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    load();
  }, [isAuthenticated, load]);

  // Socket: listen for new notifications
  useEffect(() => {
    if (!socket) return;

    const onNew = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", onNew);
    return () => {
      socket.off("notification", onNew);
    };
  }, [socket]);

  const markRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): INotificationContext => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
};
