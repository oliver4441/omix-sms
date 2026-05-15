"use client";
import { Suspense } from "react";
import DepartmentLogin from "@/components/auth/DepartmentLogin";
import { FlaskConical } from "lucide-react";

function ScienceLabLoginPage() {
  return (
    <DepartmentLogin
      department="Science Laboratory"
      departmentName="Science Lab"
      requiredRole="lab_technician"
      icon={<FlaskConical className="w-10 h-10 text-white" />}
      dashboardPath="/science-lab/dashboard"
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <ScienceLabLoginPage />
    </Suspense>
  );
}
