"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormField from "@/components/ui/FormField";

export default function NewTeacherPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    employeeNo: "",
    firstName: "",
    lastName: "",
    gender: "" as "male" | "female" | "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    status: "active" as "active" | "inactive",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.employeeNo.trim()) newErrors.employeeNo = "Employee number is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          gender: form.gender || null,
          email: form.email || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create teacher");
      }

      toast.success("Teacher created successfully!");
      router.push("/teachers");
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
        Back to Teachers
      </button>

      <div>
        <h1 className="text-2xl font-bold gradient-text">Add New Teacher</h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the teacher&apos;s details below
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 border-border space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Employee No" required error={errors.employeeNo}>
            <input
              type="text"
              name="employeeNo"
              value={form.employeeNo}
              onChange={handleChange}
              placeholder="e.g. EMP-001"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Gender">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 focus:outline-none input-glow transition-all"
            >
              <option value="">Select gender</option>
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
              placeholder="Jane"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Last Name" required error={errors.lastName}>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Smith"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane.smith@school.com"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>

          <FormField label="Phone">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+254 7XX XXX XXX"
              className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
            />
          </FormField>
        </div>

        <div className="border-t border-border pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Qualification">
              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. B.Ed, M.Ed"
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
              />
            </FormField>

            <FormField label="Specialization">
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="e.g. Mathematics, Physics"
                className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all"
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
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
          </div>
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
            {saving ? "Saving..." : "Save Teacher"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
