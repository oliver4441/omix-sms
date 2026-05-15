import DepartmentLayout from "@/components/layouts/DepartmentLayout";

export default function ScienceLabDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DepartmentLayout department="science-lab">{children}</DepartmentLayout>;
}
