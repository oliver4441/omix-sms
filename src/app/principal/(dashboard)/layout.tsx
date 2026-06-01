"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const PRINCIPAL_NAV_ITEMS: NavItem[] = [
  { href: "/principal/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/principal/dashboard/departments", label: "All Departments", icon: "Building2" },
  { href: "/principal/dashboard/reports", label: "Reports", icon: "BarChart3" },
  { href: "/principal/dashboard/notifications", label: "Notifications", icon: "Bell" },
  { href: "/principal/dashboard/settings", label: "Settings", icon: "Settings" },
];

// Quick department links shown in a sub-section
const DEPARTMENT_LINKS = [
  { href: "/bursar/dashboard", label: "Bursar", icon: "Banknote", color: "from-emerald-500 to-emerald-700" },
  { href: "/library/dashboard", label: "Library", icon: "Library", color: "from-amber-500 to-amber-700" },
  { href: "/science-lab/dashboard", label: "Science Lab", icon: "FlaskConical", color: "from-cyan-500 to-cyan-700" },
  { href: "/computer-lab/dashboard", label: "Computer Lab", icon: "Monitor", color: "from-purple-500 to-purple-700" },
  { href: "/board/dashboard", label: "Board", icon: "Building2", color: "from-blue-500 to-blue-700" },
];

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/principal/dashboard") {
      return pathname === "/principal/dashboard";
    }
    return pathname.startsWith(href + "/") || pathname === href;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <Link href="/principal/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center glow-sm flex-shrink-0">
            <Icon name="GraduationCap" className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-200">Principal</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {PRINCIPAL_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-omix-500/10 text-omix-400 border border-omix-500/20"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            )}
          >
            <Icon name={item.icon} className="w-4 h-4" />
            {item.label}
          </Link>
        ))}

        <div className="pt-4 pb-2">
          <p className="px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Departments</p>
        </div>
        {DEPARTMENT_LINKS.map((dept) => (
          <Link
            key={dept.href}
            href={dept.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          >
            <div className={cn("w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center", dept.color)}>
              <Icon name={dept.icon} className="w-3 h-3 text-white" />
            </div>
            {dept.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
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
      )}

      {/* Desktop sidebar - non-collapsible */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-surface/80 backdrop-blur-xl border-r border-border z-30">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
