import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuthStore } from "../store/authStore";

import AdminWidget from "../components/dashboard/AdminWidget";
import ManagerWidgets from "../components/dashboard/ManagerWidgets";
import EmployeeWidget from "../components/dashboard/EmployeeWidget";
import ClientWidget from "../components/dashboard/ClientWidget";
import ClientRequestsWidget from "../components/dashboard/ClientRequestsWidget";

import ProjectList from "../components/dashboard/ProjectList";

export default function Dashboard() {
  const role = useAuthStore((state) => state.role);

  return (
    <DashboardLayout>
      {role === "admin" && (
        <>
          <AdminWidget />
          <div className="mb-6">
            <ClientRequestsWidget />
          </div>
        </>
      )}
      {role === "manager" && (
        <>
          <ManagerWidgets />
          <div className="mb-6">
            <ClientRequestsWidget />
          </div>
        </>
      )}
      {role === "employee" && <EmployeeWidget />}
      {role === "client" && <ClientWidget />}
      {role !== "client" && <ProjectList />}
    </DashboardLayout>
  );
}
