"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  DollarSign,
  UserCheck,
  ArrowUpRight,
  Calendar,
  Bell,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  recentPayments: {
    id: string;
    amount: number;
    method: string;
    term: string;
    paymentDate: string;
    student: { id: string; firstName: string; lastName: string; admissionNo: string };
    feeStructure: { name: string };
  }[];
  recentActivity: {
    id: string;
    type: string;
    description: string;
    date: string;
  }[];
  studentEnrollmentByClass: {
    id: string;
    name: string;
    code: string;
    studentCount: number;
  }[];
  feeCollectionByMonth: {
    month: string;
    year: string;
    total: number;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="h-12 w-12 bg-surface-2 rounded-xl mb-4" />
              <div className="h-8 w-24 bg-surface-2 rounded-lg mb-2" />
              <div className="h-4 w-32 bg-surface-2 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-2 bg-omix-500/20 border border-omix-500/30 rounded-xl text-omix-400 hover:bg-omix-500/30 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const feeData = stats.feeCollectionByMonth.map((f) => ({
    month: f.month,
    amount: f.total,
  }));

  const activityIcons: Record<string, React.ReactNode> = {
    student_created: <Users className="w-4 h-4 text-blue-400" />,
    teacher_created: <GraduationCap className="w-4 h-4 text-emerald-400" />,
    class_created: <BookOpen className="w-4 h-4 text-amber-400" />,
    enrollment_created: <UserCheck className="w-4 h-4 text-omix-400" />,
    payment_received: <DollarSign className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview of your school&apos;s performance
        </p>
      </div>

      {/* Stat Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="omix"
            trend={{ value: 8, positive: true }}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={GraduationCap}
            color="green"
            trend={{ value: 3, positive: true }}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            title="Active Classes"
            value={stats.totalClasses}
            icon={BookOpen}
            color="blue"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon={ClipboardCheck}
            color="amber"
            subtitle="Current academic year"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            title="Fee Collections"
            value={stats.recentPayments.reduce((sum, p) => sum + p.amount, 0)}
            icon={DollarSign}
            color="green"
            subtitle="Total collected"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <StatCard
            title="Active Enrollments"
            value={stats.studentEnrollmentByClass.reduce(
              (sum, c) => sum + c.studentCount,
              0
            )}
            icon={UserCheck}
            color="rose"
          />
        </motion.div>
      </motion.div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by Class Chart */}
        <div className="glass rounded-2xl p-6 border-border">
          <h2 className="text-lg font-semibold text-white mb-4">
            Enrollment by Class
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.studentEnrollmentByClass}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(99,102,241,0.1)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(99,102,241,0.15)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(99,102,241,0.15)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(18,18,42,0.95)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                    backdropFilter: "blur(12px)",
                  }}
                  cursor={{ fill: "rgba(99,102,241,0.1)" }}
                />
                <Bar
                  dataKey="studentCount"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Chart */}
        <div className="glass rounded-2xl p-6 border-border">
          <h2 className="text-lg font-semibold text-white mb-4">
            Fee Collections (Monthly)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={feeData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(99,102,241,0.1)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(99,102,241,0.15)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(99,102,241,0.15)" }}
                  tickLine={false}
                  tickFormatter={(v) => `KSh ${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(18,18,42,0.95)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "12px",
                    color: "#e2e8f0",
                    backdropFilter: "blur(12px)",
                  }}
                  cursor={{ fill: "rgba(99,102,241,0.1)" }}
                  formatter={(value: number) => [formatCurrency(value), "Collected"]}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#feeGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Payments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="glass rounded-2xl p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Payments
            </h2>
            <Link
              href="/fees"
              className="text-sm text-omix-400 hover:text-omix-300 flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentPayments.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                No recent payments
              </p>
            ) : (
              stats.recentPayments.map((payment, idx) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-2/50 border border-border hover:bg-surface-2 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {payment.student.firstName} {payment.student.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.feeStructure.name} &middot;{" "}
                        {formatDate(payment.paymentDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {payment.method}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity / Announcements */}
        <div className="glass rounded-2xl p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>
            <Link
              href="/announcements"
              className="text-sm text-omix-400 hover:text-omix-300 flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                No recent activity
              </p>
            ) : (
              stats.recentActivity.map((activity, idx) => (
                <motion.div
                  key={`${activity.type}-${activity.id}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 border border-border hover:bg-surface-2 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {activityIcons[activity.type] || (
                      <Bell className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-snug">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
