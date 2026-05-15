"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationPanel from "./NotificationPanel";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  isRead: boolean;
  createdAt: string;
  link?: string | null;
  sender?: { id: string; name: string } | null;
}

interface ApiResponse {
  notifications: Notification[];
  unreadCount: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // ── Fetch notifications ────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: ApiResponse = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("NotificationBell: fetch error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Poll every 60s ─────────────────────────────────────────────────────────

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ── Mark one as read ───────────────────────────────────────────────────────

  const handleMarkRead = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to mark as read");
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("NotificationBell: mark read error", err);
      }
    },
    []
  );

  // ── Mark all as read ───────────────────────────────────────────────────────

  const handleMarkAllRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(
        unreadIds.map((id) =>
          fetch(`/api/notifications/${id}/read`, { method: "POST" })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("NotificationBell: mark all read error", err);
    }
  }, [notifications]);

  // ── Close on outside click ─────────────────────────────────────────────────

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div ref={bellRef} className="relative">
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchNotifications(); // Refresh on open
        }}
        className={cn(
          "relative w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center transition-all",
          open
            ? "text-omix-400 border-omix-500/30"
            : "text-gray-400 hover:text-gray-200 hover:border-omix-500/30"
        )}
      >
        <Bell className="w-4 h-4" />

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={cn(
                "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center",
                "bg-gradient-to-r from-omix-500 to-omix-600 shadow-lg shadow-omix-500/30"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulsing ring when unread */}
        {unreadCount > 0 && (
          <motion.span
            className="absolute inset-0 rounded-xl border-2 border-omix-400/40"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <NotificationPanel
            notifications={notifications}
            unreadCount={unreadCount}
            loading={loading}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
