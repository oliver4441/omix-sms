"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
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

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

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
    case "urgent":
      return "text-red-400";
    case "high":
      return "text-orange-400";
    case "normal":
      return "text-omix-400";
    case "low":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case "urgent":
      return AlertTriangle;
    case "high":
      return AlertCircle;
    case "normal":
      return Bell;
    case "low":
      return Info;
    default:
      return Info;
  }
}

function groupByDate(notifications: Notification[]): Map<string, Notification[]> {
  const groups = new Map<string, Notification[]>();
  const today = new Date().toLocaleDateString("en-KE");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-KE");

  for (const n of notifications) {
    const d = new Date(n.createdAt);
    const key = d.toLocaleDateString("en-KE") === today
      ? "Today"
      : d.toLocaleDateString("en-KE") === yesterday
        ? "Yesterday"
        : d.toLocaleDateString("en-KE", { weekday: "long", month: "short", day: "numeric" });
    
    const existing = groups.get(key) || [];
    existing.push(n);
    groups.set(key, existing);
  }
  return groups;
}

// ─── Notification Item ───────────────────────────────────────────────────────

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const PriorityIcon = getPriorityIcon(notification.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative group flex gap-3 px-4 py-3 transition-all",
        !notification.isRead
          ? "bg-omix-500/5 border-l-2 border-omix-500/40"
          : "border-l-2 border-transparent hover:bg-white/[0.02]"
      )}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-omix-400 to-omix-600"
          layoutId={`notification-glow-${notification.id}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Priority icon */}
      <div className="flex-shrink-0 mt-0.5">
        <PriorityIcon className={cn("w-4 h-4", getPriorityColor(notification.priority))} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-snug",
              !notification.isRead ? "text-gray-100 font-medium" : "text-gray-300"
            )}
          >
            {notification.link ? (
              <Link href={notification.link} className="hover:text-omix-400 transition-colors">
                {notification.title}
              </Link>
            ) : (
              notification.title
            )}
          </p>
          <span className="text-[10px] text-gray-500 flex-shrink-0 whitespace-nowrap">
            {getTimeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.content}</p>

        {/* Sender + Mark read */}
        <div className="flex items-center justify-between mt-1.5">
          {notification.sender ? (
            <span className="text-[10px] text-gray-600">by {notification.sender.name}</span>
          ) : (
            <span />
          )}

          {!notification.isRead && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-omix-400 bg-omix-500/10 hover:bg-omix-500/20 transition-all"
            >
              <Check className="w-3 h-3" />
              Mark read
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────

export default function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  onMarkRead,
  onMarkAllRead,
  onClose,
}: NotificationPanelProps) {
  const grouped = groupByDate(notifications);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute right-0 top-full mt-2 w-[400px] max-w-[calc(100vw-2rem)] max-h-[70vh] flex flex-col glass rounded-2xl glow-sm overflow-hidden z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-omix-400" />
          <h3 className="text-sm font-semibold text-gray-200">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-omix-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onMarkAllRead}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-omix-400 bg-omix-500/10 hover:bg-omix-500/20 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </motion.button>
          )}
          <Link
            href="/notifications"
            onClick={onClose}
            className="text-[11px] text-gray-500 hover:text-omix-400 transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-omix-400 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-400">All caught up!</p>
            <p className="text-xs text-gray-600 mt-1">No new notifications yet.</p>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <div className="sticky top-0 bg-surface/90 backdrop-blur-md px-4 py-2 border-b border-border/50">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {dateLabel}
                </span>
              </div>
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
