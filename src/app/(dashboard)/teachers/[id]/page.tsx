"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  Calendar,
  Edit,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface TeacherProfile {
  id: string;
  employeeNo: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  email: string | null;
  phone: string | null;
  qualification: string | null;
  specialization: string | null;
  dateOfBirth: string | null;
  address: string | null;
  status: string;
  createdAt: string;
  classes: {
    id: string;
    name: string;
    code: string;
    academicYear: string;
    _count: { enrollments: number };
  }[];
  subjects: {
    id: string;
    name: string;
    code: string;
    classId: string | null;
  }[];
  _count: { classes: number; subjects: number; announcements: number };
}

export default function TeacherProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeacher();
  }, [params.id]);

  async function fetchTeacher() {
    try {
      setLoading(true);
      const res = await fetch(`/api/teachers/${params.id}`);
      if (!res.ok) throw new Error("Teacher not found");
      const data = await res.json();
      setTeacher(data.teacher);
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface-2 rounded-xl mb-3" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-red-400 mb-4">{error || "Teacher not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-omix-500/20 border border-omix-500/30 rounded-xl text-omix-400 hover:bg-omix-500/30 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Teachers
      </button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border-border"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 glow-sm">
            <span className="text-2xl font-bold text-white">
              {teacher.firstName[0]}
              {teacher.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                {teacher.firstName} {teacher.lastName}
              </h1>
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full border",
                  teacher.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                )}
              >
                {teacher.status}
              </span>
            </div>
            <p className="text-sm text-emerald-400 font-mono mt-1">
              {teacher.employeeNo}
            </p>
            <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-gray-400">
              {teacher.specialization && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> {teacher.specialization}
                </span>
              )}
              {teacher.gender && (
                <span className="capitalize flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> {teacher.gender}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Joined{" "}
                {formatDate(teacher.createdAt)}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="glass rounded-2xl p-5 border-border">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Contact Info
          </h2>
          <div className="space-y-3">
            {teacher.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-200">{teacher.email}</p>
                </div>
              </div>
            )}
            {teacher.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-200">{teacher.phone}</p>
                </div>
              </div>
            )}
            {!teacher.email && !teacher.phone && (
              <p className="text-sm text-gray-500">No contact info</p>
            )}
          </div>
        </div>

        {/* Professional Info */}
        <div className="glass rounded-2xl p-5 border-border">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Professional Info
          </h2>
          <div className="space-y-3">
            {teacher.qualification && (
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Qualification</p>
                  <p className="text-sm text-gray-200">{teacher.qualification}</p>
                </div>
              </div>
            )}
            {teacher.specialization && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Specialization</p>
                  <p className="text-sm text-gray-200">{teacher.specialization}</p>
                </div>
              </div>
            )}
            {!teacher.qualification && !teacher.specialization && (
              <p className="text-sm text-gray-500">No professional info</p>
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
              <p className="text-2xl font-bold text-emerald-400">
                {teacher._count.classes}
              </p>
              <p className="text-xs text-gray-500 mt-1">Classes</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-2">
              <p className="text-2xl font-bold text-omix-400">
                {teacher._count.subjects}
              </p>
              <p className="text-xs text-gray-500 mt-1">Subjects</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-2">
              <p className="text-2xl font-bold text-amber-400">
                {teacher._count.announcements}
              </p>
              <p className="text-xs text-gray-500 mt-1">Announcements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Taught */}
      <div className="glass rounded-2xl p-6 border-border">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Classes Teaching
        </h2>
        {teacher.classes.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No classes assigned
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacher.classes.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl bg-surface-2 border border-border hover:border-emerald-500/30 transition-all cursor-pointer"
                onClick={() => router.push(`/classes/${cls.id}`)}
              >
                <h3 className="text-sm font-semibold text-gray-200">
                  {cls.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {cls.code} &middot; {cls.academicYear}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {cls._count.enrollments} students enrolled
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subjects Assigned */}
      <div className="glass rounded-2xl p-6 border-border">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-omix-400" />
          Subjects Assigned
        </h2>
        {teacher.subjects.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No subjects assigned
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teacher.subjects.map((subj) => (
                  <tr key={subj.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-200">{subj.name}</td>
                    <td className="px-4 py-3 text-sm text-omix-400 font-mono">
                      {subj.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {subj.classId ? (
                        <span className="text-gray-300">Assigned to class</span>
                      ) : (
                        <span className="text-gray-500">General</span>
                      )}
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
