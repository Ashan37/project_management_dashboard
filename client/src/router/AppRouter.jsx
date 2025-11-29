import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ClientPortal from "../pages/ClientPortal";
import ClientRequests from "../pages/ClientRequests";
import ProtectedRoute from "./ProtectedRoute";
import TaskBoard from "../pages/TaskBoard";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import Tasks from "../pages/Tasks";
import Users from "../pages/Users";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager", "employee"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager", "employee"]}
            >
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager", "employee"]}
            >
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager", "employee"]}
            >
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager"]}
            >
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-requests"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager"]}
            >
              <ClientRequests />
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

        <Route
          path="/projects/:projectId/kanban"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager", "employee"]}
            >
              <TaskBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
