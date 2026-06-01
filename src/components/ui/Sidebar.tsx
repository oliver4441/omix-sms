"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon"

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/students", label: "Students", icon: "Users" },
  { href: "/teachers", label: "Teachers", icon: "GraduationCap" },
  { href: "/classes", label: "Classes", icon: "BookOpen" },
  { href: "/attendance", label: "Attendance", icon: "ClipboardCheck" },
  { href: "/grades", label: "Grades", icon: "FileSpreadsheet" },
  { href: "/fees", label: "Fees", icon: "DollarSign" },
  { href: "/ai", label: "AI Assistant", icon: "Bot" },
  { href: "/announcements", label: "Announcements", icon: "Bell" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-omix-500 to-omix-700 flex items-center justify-center glow-sm flex-shrink-0">
            <span className="text-white font-bold text-sm">OS</span>
          </div>
          <div
          >
            <h1 className="text-sm font-bold gradient-text leading-tight">omixsystems</h1>
            <p className="text-[10px] text-gray-500">School Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                active
                  ? "bg-omix-500/15 text-omix-400 border border-omix-500/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5 hover:border hover:border-white/5"
              )}
            >
              {active && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-omix-500/10 to-transparent rounded-xl"
                />
              )}
              <Icon name={item.icon} className={cn("w-5 h-5 flex-shrink-0 relative z-10", active && "text-omix-400")} />
              <span className="text-sm font-medium relative z-10">{item.label}</span>
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-omix-500 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-gray-400 hover:text-gray-200"
      >
        <Icon name="Menu" className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 bg-surface border-r border-border"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-gray-400 hover:text-gray-200"
        >
          <Icon name="X" className="w-4 h-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar - non-collapsible */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-surface/80 backdrop-blur-xl border-r border-border z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
