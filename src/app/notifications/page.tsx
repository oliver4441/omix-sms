"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  Info,
  AlertCircle,
  ArrowUp,
  Loader2,
  Inbox,
  ArrowLeft,
  Filter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

type FilterMode = "all" | "unread" | "read";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
  });
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent": return "text-red-400";
    case "high": return "text-orange-400";
    case "normal": return "text-omix-400";
    case "low": return "text-gray-400";
    default: return "text-gray-400";
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case "urgent": return AlertTriangle;
    case "high": return AlertCircle;
    case "normal": return Bell;
    case "low": return Info;
    default: return Info;
  }
}

function getPriorityLabel(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Notification Card ───────────────────────────────────────────────────────

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const PriorityIcon = getPriorityIcon(notification.priority);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMarkRead = async () => {
    setIsAnimating(true);
    await onMarkRead(notification.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        "glass rounded-xl border transition-all overflow-hidden",
        !notification.isRead
          ? "border-omix-500/20 glow-sm"
          : "border-border/60 opacity-70 hover:opacity-100"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Priority icon */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              !notification.isRead
                ? "bg-omix-500/10"
                : "bg-surface-2"
            )}
          >
            <PriorityIcon
              className={cn(
                "w-4 h-4",
                getPriorityColor(notification.priority)
              )}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={cn(
                      "text-sm leading-snug",
                      !notification.isRead
                        ? "text-gray-100 font-semibold"
                        : "text-gray-300 font-medium"
                    )}
                  >
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        className="hover:text-omix-400 transition-colors"
                      >
                        {notification.title}
                      </Link>
                    ) : (
                      notification.title
                    )}
                  </h3>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                      getPriorityColor(notification.priority).replace("text-", "border-").replace("red", "red").replace("orange", "orange").replace("omix", "omix").replace("gray", "gray") + " " + getPriorityColor(notification.priority).replace("text-", "bg-").replace("400", "400/10")
                    )}
                  >
                    {getPriorityLabel(notification.priority)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  {notification.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.isRead && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkRead}
                    disabled={isAnimating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-omix-400 bg-omix-500/10 hover:bg-omix-500/20 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Read
                  </motion.button>
                )}
                {notification.isRead && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-gray-500">
                    <Check className="w-3 h-3" />
                    Read
                  </span>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getTimeAgo(notification.createdAt)}
              </span>
              <span>·</span>
              <span>{formatTime(notification.createdAt)}</span>
              <span>·</span>
              <span>{formatDate(notification.createdAt)}</span>
              {notification.sender && (
                <>
                  <span>·</span>
                  <span>by {notification.sender.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unread indicator bar */}
      {!notification.isRead && (
        <motion.div
          className="h-0.5 bg-gradient-to-r from-omix-500 to-omix-400"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

// ─── Filter Tabs ─────────────────────────────────────────────────────────────

function FilterTabs({
  current,
  onChange,
  counts,
}: {
  current: FilterMode;
  onChange: (mode: FilterMode) => void;
  counts: { all: number; unread: number; read: number };
}) {
  const tabs: { key: FilterMode; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "unread", label: "Unread", count: counts.unread },
    { key: "read", label: "Read", count: counts.read },
  ];

  return (
    <div className="flex gap-1 p-1 glass rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "relative px-4 py-2 rounded-lg text-sm font-medium transition-all",
            current === tab.key
              ? "text-omix-400"
              : "text-gray-500 hover:text-gray-300"
          )}
        >
          {current === tab.key && (
            <motion.div
              layoutId="notification-filter-bg"
              className="absolute inset-0 bg-omix-500/10 rounded-lg border border-omix-500/20"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.label}
            <span
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                current === tab.key
                  ? "bg-omix-500/20 text-omix-400"
                  : "bg-surface-2 text-gray-500"
              )}
            >
              {tab.count}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_SIZE = 20;

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: { notifications: Notification[]; unreadCount: number } =
          await res.json();

        const all = data.notifications || [];
        setNotifications((prev) => (append ? [...prev, ...all] : all));
        setHasMore(all.length >= PAGE_SIZE);
      } catch (err) {
        console.error("NotificationsPage: fetch error", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  // ── Mark as read ───────────────────────────────────────────────────────────

  const handleMarkRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("NotificationsPage: mark read error", err);
    }
  }, []);

  // ── Mark all as read ───────────────────────────────────────────────────────

  const handleMarkAllRead = useCallback(async () => {
    const unreadIds = notifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(
        unreadIds.map((id) =>
          fetch(`/api/notifications/${id}/read`, { method: "POST" })
        )
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("NotificationsPage: mark all read error", err);
    }
  }, [notifications]);

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    read: notifications.filter((n) => n.isRead).length,
  };

  const hasUnread = counts.unread > 0;

  // ── Load more ──────────────────────────────────────────────────────────────

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-gray-400 hover:text-gray-200 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-lg font-bold gradient-text">Notifications</h1>
                <p className="text-xs text-gray-500">
                  {counts.unread > 0
                    ? `${counts.unread} unread notification${counts.unread !== 1 ? "s" : ""}`
                    : "All caught up"}
                </p>
              </div>
            </div>

            {hasUnread && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-omix-400 bg-omix-500/10 hover:bg-omix-500/20 transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <FilterTabs current={filter} onChange={setFilter} counts={counts} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-omix-400 animate-spin" />
            <p className="text-sm text-gray-500 mt-3">Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-300">
              {filter === "all"
                ? "No notifications yet"
                : filter === "unread"
                  ? "No unread notifications"
                  : "No read notifications"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {filter === "all"
                ? "Notifications will appear here when you receive them."
                : "Try switching to a different filter."}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Load more */}
        {!loading && hasMore && filtered.length > 0 && (
          <div className="flex justify-center py-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-gray-400 bg-surface-2 border border-border hover:border-omix-500/20 hover:text-omix-400 transition-all"
            >
              {loadingMore ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {loadingMore ? "Loading..." : "Load more"}
            </motion.button>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
