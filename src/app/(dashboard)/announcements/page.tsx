"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Plus,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  Megaphone,
  Users,
  CalendarDays,
  User,
  ChevronDown,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  target: "all" | "students" | "teachers";
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    icon: Info,
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    badge: "gray",
  },
  normal: {
    label: "Normal",
    icon: Bell,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    badge: "blue",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    badge: "amber",
  },
  urgent: {
    label: "Urgent",
    icon: AlertCircle,
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    badge: "red",
  },
};

const TARGET_LABELS: Record<string, string> = {
  all: "Everyone",
  students: "Students Only",
  teachers: "Teachers Only",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [target, setTarget] = useState<"all" | "students" | "teachers">("all");

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/announcements?limit=50");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          priority,
          target,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create announcement");
      }

      setSuccess("Announcement published successfully!");
      setTitle("");
      setContent("");
      setPriority("normal");
      setTarget("all");
      fetchAnnouncements();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">Announcements</h1>
        <p className="text-gray-400 text-sm mt-1">
          Create and manage school announcements
        </p>
      </div>

      {/* Success / Error */}
      {success && (
        <div className="glass rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </p>
        </div>
      )}
      {error && (
        <div className="glass rounded-2xl p-4 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Create Announcement Form */}
      <div className="glass rounded-2xl p-6 border-border">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-omix-500/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-omix-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              New Announcement
            </h2>
            <p className="text-xs text-gray-500">
              Share information with students, teachers, or everyone
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Title <span className="text-omix-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title..."
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Content <span className="text-omix-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement here..."
              rows={4}
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all resize-none"
            />
          </div>

          {/* Priority + Target Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "normal" | "high" | "urgent")
                }
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Target Audience
              </label>
              <select
                value={target}
                onChange={(e) =>
                  setTarget(e.target.value as "all" | "students" | "teachers")
                }
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
              >
                <option value="all">Everyone</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-omix-600 to-omix-500 hover:from-omix-500 hover:to-omix-400 text-white font-medium rounded-xl transition-all duration-300 glow-sm disabled:opacity-40"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Publish Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="glass rounded-2xl overflow-hidden border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-omix-400" />
            Recent Announcements
          </h2>
          <span className="text-xs text-gray-500 bg-surface-2 px-2.5 py-1 rounded-lg">
            {announcements.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-surface-2 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Megaphone className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No announcements yet
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Create your first announcement using the form above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {announcements.map((announcement, idx) => {
              const priorityConfig = PRIORITY_CONFIG[announcement.priority];
              const PriorityIcon = priorityConfig.icon;
              const TargetIcon =
                announcement.target === "all"
                  ? Users
                  : announcement.target === "students"
                  ? Users
                  : User;

              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-6 py-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Priority Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        priorityConfig.color.split(" ")[0]
                      )}
                    >
                      <PriorityIcon
                        className={cn(
                          "w-5 h-5",
                          priorityConfig.color.split(" ")[1]
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + Badges */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-base font-semibold text-white">
                          {announcement.title}
                        </h3>
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                            priorityConfig.color
                          )}
                        >
                          {priorityConfig.label}
                        </span>
                        <span className="text-[10px] text-gray-500 bg-surface-2 px-2 py-0.5 rounded-full">
                          {TARGET_LABELS[announcement.target]}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        {announcement.content}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {announcement.author?.name || "System"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(announcement.createdAt)}
                        </span>
                        <span className="capitalize flex items-center gap-1.5">
                          <TargetIcon className="w-3.5 h-3.5" />
                          {TARGET_LABELS[announcement.target]}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
