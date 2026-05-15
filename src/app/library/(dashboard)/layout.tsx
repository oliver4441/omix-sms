import DepartmentLayout from "@/components/layouts/DepartmentLayout";

export default function LibraryDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DepartmentLayout department="library">{children}</DepartmentLayout>;
}
