import DepartmentLayout from "@/components/layouts/DepartmentLayout";

export default function ComputerLabDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DepartmentLayout department="computer-lab">{children}</DepartmentLayout>;
}
