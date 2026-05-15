"use client";
import { Suspense } from "react";
import DepartmentLogin from "@/components/auth/DepartmentLogin";
import { GraduationCap } from "lucide-react";

function PrincipalLoginPage() {
  return (
    <DepartmentLogin
      department="Principal's Office"
      departmentName="Principal"
      requiredRole="school_admin"
      icon={<GraduationCap className="w-10 h-10 text-white" />}
      dashboardPath="/principal/dashboard"
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <PrincipalLoginPage />
    </Suspense>
  );
}
