"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormField from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

interface ClassOption {
  id: string;
  name: string;
  code: string;
  academicYear: string;
}

export default function NewStudentPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    admissionNo: "",
    firstName: "",
    lastName: "",
    gender: "male" as "male" | "female",
    dateOfBirth: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
    classId: "",
    status: "active" as "active" | "graduated" | "transferred",
  });

  useEffect(() => {
    fetch("/api/classes?limit=200")
      .then((r) => r.json())
      .then((data) => setClasses(data.classes))
      .catch(() => toast.error("Failed to load classes"));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!form.admissionNo.trim()) newErrors.admissionNo = "Admission number is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guardianEmail: form.guardianEmail || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create student");
      }

      toast.success("Student created successfully!");
      router.push("/students");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">Add New Student</h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the student&apos;s details below
        </p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 border-border space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Admission No" required error={errors.admissionNo}>
            <input
              type="text"
              name="admissionNo"
              value={form.admissionNo}
              onChange={handleChange}
              placeholder="e.g. ADM-001"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Gender" required>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </FormField>

          <FormField label="First Name" required error={errors.firstName}>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Last Name" required error={errors.lastName}>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Date of Birth">
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Status">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
            >
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="transferred">Transferred</option>
            </select>
          </FormField>
        </div>

        {/* Guardian Section */}
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Guardian Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Guardian Name">
              <input
                type="text"
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                placeholder="Parent/Guardian full name"
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
              />
            </FormField>

            <FormField label="Guardian Phone">
              <input
                type="tel"
                name="guardianPhone"
                value={form.guardianPhone}
                onChange={handleChange}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
              />
            </FormField>

            <FormField label="Guardian Email">
              <input
                type="email"
                name="guardianEmail"
                value={form.guardianEmail}
                onChange={handleChange}
                placeholder="guardian@example.com"
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
              />
            </FormField>

            <FormField label="Class Enrollment">
              <select
                name="classId"
                value={form.classId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
              >
                <option value="">No class (enroll later)</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code}) — {c.academicYear}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        {/* Address */}
        <div className="border-t border-border pt-5">
          <FormField label="Address">
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              placeholder="Physical address"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all resize-none"
            />
          </FormField>
        </div>

        {/* Submit */}
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
            {saving ? "Saving..." : "Save Student"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
