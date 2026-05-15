"use client";
import { Suspense } from "react";
import DepartmentLogin from "@/components/auth/DepartmentLogin";
import { BookOpen } from "lucide-react";

function DepartmentHeadLoginPage() {
  return (
    <DepartmentLogin
      department="Department Head"
      departmentName="Department Head"
      requiredRole="department_head"
      icon={<BookOpen className="w-10 h-10 text-white" />}
      dashboardPath="/departments/dashboard"
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <DepartmentHeadLoginPage />
    </Suspense>
  );
}
