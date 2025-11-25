import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuthStore } from "../store/authStore";

import AdminWidget from "../components/dashboard/AdminWidget";
import ManagerWidgets from "../components/dashboard/ManagerWidgets";
import EmployeeWidget from "../components/dashboard/EmployeeWidget";
import ClientWidget from "../components/dashboard/ClientWidget";

import ProjectList from "../components/dashboard/ProjectList";

export default function Dashboard() {
  const role = useAuthStore((state) => state.role);

  return (
    <DashboardLayout>
      {role === "admin" && <AdminWidget />}
      {role === "manager" && <ManagerWidgets />}
      {role === "employee" && <EmployeeWidget />}
      {role === "client" && <ClientWidget />}
      {role !== "client" && <ProjectList />}
    </DashboardLayout>
  );
}
