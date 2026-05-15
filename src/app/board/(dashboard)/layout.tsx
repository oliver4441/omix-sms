import DepartmentLayout from "@/components/layouts/DepartmentLayout";

export default function BoardDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DepartmentLayout department="board">{children}</DepartmentLayout>;
}
