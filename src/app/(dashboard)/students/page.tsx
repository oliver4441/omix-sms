"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Users, Filter } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

interface Enrollment {
  id: string;
  status: string;
  class: { id: string; name: string; code: string };
}

interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: string;
  status: string;
  enrollments: Enrollment[];
}

interface ClassOption {
  id: string;
  name: string;
  code: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (classFilter) params.set("classId", classFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/students?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search, classFilter, statusFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetch("/api/classes?limit=200")
      .then((r) => r.json())
      .then((data) => setClasses(data.classes))
      .catch(() => {});
  }, []);

  const columns = [
    {
      key: "admissionNo",
      header: "Admission No",
      sortable: true,
      render: (s: Student) => (
        <span className="font-mono text-xs text-omix-400">{s.admissionNo}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (s: Student) => (
        <span className="text-gray-200 font-medium">
          {s.firstName} {s.lastName}
        </span>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      sortable: true,
      render: (s: Student) => (
        <span className="capitalize text-gray-400">{s.gender}</span>
      ),
    },
    {
      key: "class",
      header: "Class",
      render: (s: Student) => {
        const activeEnrollment = s.enrollments?.find(
          (e) => e.status === "active"
        );
        return (
          <span className="text-gray-300">
            {activeEnrollment
              ? `${activeEnrollment.class.name} (${activeEnrollment.class.code})`
              : "—"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (s: Student) => (
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            s.status === "active" &&
              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
            s.status === "graduated" &&
              "bg-blue-500/10 text-blue-400 border border-blue-500/20",
            s.status === "transferred" &&
              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          )}
        >
          {s.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Students</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage student records and enrollments
          </p>
        </div>
        <button
          onClick={() => router.push("/students/new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-omix-600 to-omix-500 hover:from-omix-500 hover:to-omix-400 text-white font-medium rounded-xl transition-all duration-300 glow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-4 pr-4 py-2 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 bg-surface-2 border border-border rounded-xl text-sm text-gray-300 focus:outline-none input-glow transition-all"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-surface-2 border border-border rounded-xl text-sm text-gray-300 focus:outline-none input-glow transition-all"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass rounded-2xl p-4 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <DataTable<Student>
        columns={columns}
        data={students}
        searchable={false}
        loading={loading}
        emptyMessage="No students found"
        onRowClick={(student) => router.push(`/students/${student.id}`)}
        pageSize={15}
      />
    </div>
  );
}
