"use client";
import { Suspense } from "react";
import DepartmentLogin from "@/components/auth/DepartmentLogin";
import { Monitor } from "lucide-react";

function ComputerLabLoginPage() {
  return (
    <DepartmentLogin
      department="Computer Laboratory"
      departmentName="Computer Lab"
      requiredRole="computer_lab"
      icon={<Monitor className="w-10 h-10 text-white" />}
      dashboardPath="/computer-lab/dashboard"
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <ComputerLabLoginPage />
    </Suspense>
  );
}
