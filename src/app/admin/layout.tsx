"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon"

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-omix-500/30 border-t-omix-500 rounded-full"
        />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "super_admin") {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-omix-500 to-omix-700 flex items-center justify-center glow-sm flex-shrink-0">
            <Icon name="Building2" className="w-5 h-5 text-white" />
          </div>
          <div
          >
            <h1 className="text-sm font-bold gradient-text leading-tight">omixsystems</h1>
            <p className="text-[10px] text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Super Admin Badge */}
      <div className="mx-3 mb-4 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-omix-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <Icon name="Shield" className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-amber-400">Super Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
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
    <div className="flex h-screen overflow-hidden bg-surface">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-surface/70 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2">
                <Icon name="Sparkles" className="w-4 h-4 text-omix-400" />
                <span className="text-sm text-gray-400">
                  Super Admin Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-surface-2 border border-border">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-omix-500 to-omix-700 flex items-center justify-center text-white text-xs font-bold">
                  {session?.user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-200 leading-tight">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-amber-400">Super Admin</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-sm"
              >
                <Icon name="GraduationCap" className="w-4 h-4" />
                <span>Main App</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-animate">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
