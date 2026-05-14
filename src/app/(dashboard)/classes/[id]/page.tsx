"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  employeeNo: string;
  email: string;
  phone: string;
  specialization: string;
}

interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  status: string;
}

interface Enrollment {
  id: string;
  student: Student;
}

interface SubjectTeacher {
  id: string;
  firstName: string;
  lastName: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: SubjectTeacher | null;
}

interface TimetableEntrySubject {
  id: string;
  name: string;
  code: string;
}

interface TimetableEntry {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string | null;
  subject: TimetableEntrySubject | null;
}

interface ClassDetail {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  capacity: number | null;
  teacher: Teacher | null;
  enrollments: Enrollment[];
  subjects: Subject[];
  timetable: TimetableEntry[];
  _count: {
    enrollments: number;
    subjects: number;
    timetable: number;
  };
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TABS = [
  { key: "students", label: "Students", icon: Users },
  { key: "timetable", label: "Timetable", icon: Calendar },
  { key: "subjects", label: "Subjects", icon: BookOpen },
];

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("students");

  const fetchClass = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/classes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch class details");
      const data = await res.json();
      setClassData(data.class);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-surface-2 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-48 bg-surface-2 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-surface-2 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="glass rounded-2xl p-8">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-2 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchClass}
            className="px-6 py-2 bg-omix-500/20 border border-omix-500/30 rounded-xl text-omix-400 hover:bg-omix-500/30 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!classData) return null;

  const enrollmentPercent = classData.capacity
    ? Math.min(
        100,
        Math.round((classData._count.enrollments / classData.capacity) * 100)
      )
    : 0;
  const isFull = classData.capacity
    ? classData._count.enrollments >= classData.capacity
    : false;

  return (
    <div className="space-y-6">
      {/* Back + Edit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        <button
          onClick={() => router.push(`/classes/new?id=${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-omix-500/20 border border-omix-500/30 rounded-xl text-omix-400 hover:bg-omix-500/30 transition-all text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Class
        </button>
      </div>

      {/* Class Header */}
      <div className="glass rounded-2xl p-6 border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-omix-500/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7 text-omix-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold gradient-text">
                  {classData.name}
                </h1>
                <span className="text-xs font-mono text-omix-400 bg-omix-500/10 px-2.5 py-1 rounded-lg">
                  {classData.code}
                </span>
              </div>
              <p className="text-sm text-gray-400">{classData.academicYear}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {classData._count.enrollments}
              </p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {classData._count.subjects}
              </p>
              <p className="text-xs text-gray-500">Subjects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {classData._count.timetable}
              </p>
              <p className="text-xs text-gray-500">Periods</p>
            </div>
          </div>
        </div>

        {/* Teacher & Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
          {/* Teacher Info */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Class Teacher
            </p>
            {classData.teacher ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-omix-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {classData.teacher.firstName} {classData.teacher.lastName}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {classData.teacher.email}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {classData.teacher.phone}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No teacher assigned</p>
            )}
          </div>

          {/* Capacity Bar */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Capacity
            </p>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">
                    {classData._count.enrollments}
                    {classData.capacity ? ` / ${classData.capacity}` : ""}{" "}
                    students
                  </span>
                  {classData.capacity && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isFull ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {enrollmentPercent}%
                    </span>
                  )}
                </div>
                {classData.capacity && (
                  <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollmentPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        isFull
                          ? "bg-gradient-to-r from-red-500 to-red-400"
                          : enrollmentPercent > 75
                          ? "bg-gradient-to-r from-amber-500 to-amber-400"
                          : "bg-gradient-to-r from-omix-500 to-omix-400"
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl overflow-hidden border-border">
        <div className="flex border-b border-border">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all relative",
                  isActive
                    ? "text-omix-400"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-omix-500"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Students Tab */}
          {activeTab === "students" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Student Roster
                </h3>
                <span className="text-xs text-gray-500 bg-surface-2 px-2.5 py-1 rounded-lg">
                  {classData._count.enrollments} students
                </span>
              </div>
              {classData.enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No students enrolled</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admission No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {classData.enrollments.map((enrollment, idx) => {
                        const student = enrollment.student;
                        return (
                          <motion.tr
                            key={enrollment.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="hover:bg-white/5 cursor-pointer transition-colors"
                            onClick={() =>
                              router.push(`/students/${student.id}`)
                            }
                          >
                            <td className="px-4 py-3">
                              <span className="font-mono text-xs text-omix-400">
                                {student.admissionNo}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-200 font-medium">
                                {student.firstName} {student.lastName}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-400 capitalize">
                                {student.gender}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "text-xs font-medium px-2.5 py-1 rounded-full",
                                  student.status === "active" &&
                                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                )}
                              >
                                {student.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Timetable Tab */}
          {activeTab === "timetable" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Weekly Timetable
              </h3>
              {classData.timetable.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    No timetable set up yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {DAYS.map((day) => {
                        const dayEntries = classData.timetable.filter(
                          (t) => t.dayOfWeek === DAYS.indexOf(day) + 1
                        );
                        if (dayEntries.length === 0) {
                          return (
                            <tr key={day}>
                              <td className="px-4 py-3 text-sm text-gray-400 font-medium">
                                {day}
                              </td>
                              <td
                                colSpan={3}
                                className="px-4 py-3 text-sm text-gray-600"
                              >
                                No classes
                              </td>
                            </tr>
                          );
                        }
                        return dayEntries.map((entry, idx) => (
                          <motion.tr
                            key={entry.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="hover:bg-white/5 transition-colors"
                          >
                            {idx === 0 && (
                              <td
                                rowSpan={dayEntries.length}
                                className="px-4 py-3 text-sm text-gray-300 font-medium align-top pt-4"
                              >
                                {day}
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-sm text-gray-300">
                                  {entry.startTime} - {entry.endTime}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-200">
                                {entry.subject?.name ?? "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {entry.room ? (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-sm text-gray-400">
                                    {entry.room}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-600">
                                  —
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === "subjects" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Subjects
              </h3>
              {classData.subjects.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    No subjects assigned
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classData.subjects.map((subject, idx) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass rounded-xl p-4 border-border hover:glow-sm transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-omix-500/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-omix-400" />
                        </div>
                        <span className="text-xs font-mono text-omix-400 bg-omix-500/10 px-2 py-0.5 rounded-md">
                          {subject.code}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-2">
                        {subject.name}
                      </h4>
                      {subject.teacher ? (
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-400">
                            {subject.teacher.firstName}{" "}
                            {subject.teacher.lastName}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600">
                          No teacher assigned
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
