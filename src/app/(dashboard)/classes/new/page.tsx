"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormField from "@/components/ui/FormField";

interface TeacherOption {
  id: string;
  firstName: string;
  lastName: string;
  employeeNo: string;
}

export default function NewClassPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    code: "",
    academicYear: new Date().getFullYear().toString(),
    capacity: "",
    teacherId: "",
  });

  useEffect(() => {
    fetch("/api/teachers?limit=200")
      .then((r) => r.json())
      .then((data) => setTeachers(data.teachers))
      .catch(() => toast.error("Failed to load teachers"));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Class name is required";
    if (!form.code.trim()) newErrors.code = "Class code is required";
    if (!form.academicYear.trim()) newErrors.academicYear = "Academic year is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          academicYear: form.academicYear,
          capacity: form.capacity ? parseInt(form.capacity) : null,
          teacherId: form.teacherId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create class");
      }

      toast.success("Class created successfully!");
      router.push("/classes");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Classes
      </button>

      <div>
        <h1 className="text-2xl font-bold gradient-text">Add New Class</h1>
        <p className="text-gray-400 text-sm mt-1">
          Create a new class for the academic year
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 border-border space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Class Name" required error={errors.name}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Grade 9A"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Class Code" required error={errors.code}>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. 9A"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Academic Year" required error={errors.academicYear}>
            <input
              type="text"
              name="academicYear"
              value={form.academicYear}
              onChange={handleChange}
              placeholder="e.g. 2025"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Capacity" helperText="Maximum number of students">
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 45"
              min="1"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>
        </div>

        <div className="border-t border-border pt-5">
          <FormField label="Class Teacher">
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
            >
              <option value="">No teacher assigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.employeeNo})
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-200 border border-border hover:bg-surface-2 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-omix-600 to-omix-500 hover:from-omix-500 hover:to-omix-400 text-white font-medium rounded-xl transition-all duration-300 glow-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Create Class"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
