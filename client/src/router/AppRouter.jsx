import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ClientPortal from "../pages/ClientPortal";
import ProtectedRoute from "./ProtectedRoute";
import TaskBoard from "../pages/TaskBoard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "projectManager", "employee"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/portal"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Route
        path="/projects/:projectId/kanban"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "projectManager", "employee"]}
          >
            <TaskBoard />
          </ProtectedRoute>
        }
      />
    </BrowserRouter>
  );
}
