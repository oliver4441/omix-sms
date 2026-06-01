"use client";
import { Suspense } from "react";
import DepartmentLogin from "@/components/auth/DepartmentLogin";
import { Icon } from "@/components/ui/Icon"
export const dynamic = 'force-dynamic';

function LibraryLoginPage() {
  return (
    <DepartmentLogin
      department="Library"
      departmentName="Library"
      requiredRole="librarian"
      icon={<Icon name="BookOpen" className="w-10 h-10 text-white" />}
      dashboardPath="/library/dashboard"
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <LibraryLoginPage />
    </Suspense>
  );
}
