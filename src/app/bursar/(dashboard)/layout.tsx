import DepartmentLayout from "@/components/layouts/DepartmentLayout";

export default function BursarDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DepartmentLayout department="bursar">{children}</DepartmentLayout>;
}
