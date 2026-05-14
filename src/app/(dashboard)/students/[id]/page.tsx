"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Users,
  BookOpen,
  DollarSign,
  Edit,
  FileSpreadsheet,
} from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";

interface StudentProfile {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  status: string;
  createdAt: string;
  enrollments: {
    id: string;
    status: string;
    date: string;
    academicYear: string;
    class: { id: string; name: string; code: string };
  }[];
  grades: {
    id: string;
    score: number | null;
    grade: string | null;
    subject: { id: string; name: string; code: string };
    exam: { id: string; name: string; term: string; academicYear: string };
  }[];
  feePayments: {
    id: string;
    amount: number;
    method: string;
    paymentDate: string;
    term: string;
    academicYear: string;
    feeStructure: { id: string; name: string };
  }[];
  _count: {
    attendance: number;
    grades: number;
    feePayments: number;
  };
}

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  async function fetchStudent() {
    try {
      setLoading(true);
      const res = await fetch(`/api/students/${params.id}`);
      if (!res.ok) throw new Error("Student not found");
      const data = await res.json();
      setStudent(data.student);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-surface-2 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-surface-2 rounded-lg" />
              <div className="h-4 w-32 bg-surface-2 rounded-lg" />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface-2 rounded-xl mb-3" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-red-400 mb-4">{error || "Student not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-omix-500/20 border border-omix-500/30 rounded-xl text-omix-400 hover:bg-omix-500/30 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    graduated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    transferred: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border-border"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-omix-500 to-omix-700 flex items-center justify-center flex-shrink-0 glow-sm">
            <span className="text-2xl font-bold text-white">
              {student.firstName[0]}
              {student.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                {student.firstName} {student.lastName}
              </h1>
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full border",
                  statusColors[student.status]
                )}
              >
                {student.status}
              </span>
            </div>
            <p className="text-sm text-omix-400 font-mono mt-1">
              {student.admissionNo}
            </p>
            <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-gray-400">
              <span className="capitalize flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {student.gender}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />{" "}
                {formatDate(student.createdAt)}
              </span>
              {student.enrollments?.find((e) => e.status === "active") && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />{" "}
                  {student.enrollments.find((e) => e.status === "active")!.class.name}
                </span>
              )}
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-omix-500/10 border border-omix-500/20 text-omix-400 hover:bg-omix-500/20 transition-all text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="glass rounded-2xl p-5 border-border">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Personal Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Date of Birth</p>
                <p className="text-sm text-gray-200">
                  {student.dateOfBirth
                    ? formatDate(student.dateOfBirth)
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm text-gray-200">
                  {student.address || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm capitalize text-gray-200">
                  {student.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / Guardian */}
        <div className="glass rounded-2xl p-5 border-border">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Guardian Info
          </h2>
          <div className="space-y-3">
            {student.guardianName && (
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm text-gray-200">{student.guardianName}</p>
                </div>
              </div>
            )}
            {student.guardianPhone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-200">{student.guardianPhone}</p>
                </div>
              </div>
            )}
            {student.guardianEmail && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-200">{student.guardianEmail}</p>
                </div>
              </div>
            )}
            {!student.guardianName &&
              !student.guardianPhone &&
              !student.guardianEmail && (
                <p className="text-sm text-gray-500">No guardian info on file</p>
              )}
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-5 border-border">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Statistics
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-surface-2">
              <p className="text-2xl font-bold text-omix-400">
                {student._count.attendance}
              </p>
              <p className="text-xs text-gray-500 mt-1">Attendance</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-2">
              <p className="text-2xl font-bold text-emerald-400">
                {student._count.grades}
              </p>
              <p className="text-xs text-gray-500 mt-1">Grades</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-2">
              <p className="text-2xl font-bold text-amber-400">
                {student._count.feePayments}
              </p>
              <p className="text-xs text-gray-500 mt-1">Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment History */}
      <div className="glass rounded-2xl p-6 border-border">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-omix-400" />
          Enrollment History
        </h2>
        {student.enrollments.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No enrollment records
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {student.enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-200">
                      {enrollment.class.name} ({enrollment.class.code})
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {enrollment.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {formatDate(enrollment.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-full",
                          enrollment.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        )}
                      >
                        {enrollment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grades Table */}
      <div className="glass rounded-2xl p-6 border-border">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          Grade Records
        </h2>
        {student.grades.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No grade records
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {student.grades.map((g) => (
                  <tr key={g.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-200">{g.exam.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {g.subject.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {g.exam.term} — {g.exam.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-200">
                      {g.score != null ? g.score : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={cn(
                          "font-mono font-medium",
                          g.grade === "A" || g.grade === "A-"
                            ? "text-emerald-400"
                            : g.grade === "B+" || g.grade === "B" || g.grade === "B-"
                            ? "text-blue-400"
                            : g.grade === "C+" || g.grade === "C" || g.grade === "C-"
                            ? "text-amber-400"
                            : g.grade
                            ? "text-red-400"
                            : "text-gray-500"
                        )}
                      >
                        {g.grade || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fee Payments */}
      <div className="glass rounded-2xl p-6 border-border">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          Fee Payments
        </h2>
        {student.feePayments.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No fee payments recorded
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Structure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {student.feePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-200">
                      {p.feeStructure.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {p.term} — {p.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-400">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-gray-300">
                      {p.method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
