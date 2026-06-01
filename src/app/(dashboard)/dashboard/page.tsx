"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/ui/StatCard";
import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon"

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
    student_created: <Icon name="Users" className="w-4 h-4 text-blue-400" />,
    teacher_created: <Icon name="GraduationCap" className="w-4 h-4 text-emerald-400" />,
    class_created: <Icon name="BookOpen" className="w-4 h-4 text-amber-400" />,
    enrollment_created: <Icon name="UserCheck" className="w-4 h-4 text-omix-400" />,
    payment_received: <Icon name="DollarSign" className="w-4 h-4 text-emerald-400" />,
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
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
        >
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="Users"
            color="omix"
            trend={{ value: 8, positive: true }}
          />
        </div>

        <div
        >
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon="GraduationCap"
            color="green"
            trend={{ value: 3, positive: true }}
          />
        </div>

        <div
        >
          <StatCard
            title="Active Classes"
            value={stats.totalClasses}
            icon="BookOpen"
            color="blue"
          />
        </div>

        <div
        >
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon="ClipboardCheck"
            color="amber"
            subtitle="Current academic year"
          />
        </div>

        <div
        >
          <StatCard
            title="Fee Collections"
            value={stats.recentPayments.reduce((sum, p) => sum + p.amount, 0)}
            icon="DollarSign"
            color="green"
            subtitle="Total collected"
          />
        </div>

        <div
        >
          <StatCard
            title="Active Enrollments"
            value={stats.studentEnrollmentByClass.reduce(
              (sum, c) => sum + c.studentCount,
              0
            )}
            icon="UserCheck"
            color="rose"
          />
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by Class Chart */}
        <div className="glass rounded-2xl p-6 border-border">
          <h2 className="text-lg font-semibold text-white mb-4">
            Enrollment by Class
          </h2>
          <div className="h-72 flex items-center justify-center text-gray-500 text-sm">
            Enrollment chart (charts removed for lightweight build)
          </div>
        </div>

        {/* Fee Collection Chart */}
        <div className="glass rounded-2xl p-6 border-border">
          <h2 className="text-lg font-semibold text-white mb-4">
            Fee Collections (Monthly)
          </h2>
          <div className="h-72 flex items-center justify-center text-gray-500 text-sm">
            Fee collection chart (charts removed for lightweight build)
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
              View All <Icon name="ArrowUpRight" className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentPayments.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                No recent payments
              </p>
            ) : (
              stats.recentPayments.map((payment, idx) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-2/50 border border-border hover:bg-surface-2 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Icon name="DollarSign" className="w-5 h-5 text-emerald-400" />
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
                </div>
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
              View All <Icon name="ArrowUpRight" className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                No recent activity
              </p>
            ) : (
              stats.recentActivity.map((activity, idx) => (
                <div
                  key={`${activity.type}-${activity.id}-${idx}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 border border-border hover:bg-surface-2 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {activityIcons[activity.type] || (
                      <Icon name="Bell" className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-snug">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon name="Calendar" className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
