import { useAuthStore } from "../../store/authStore";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  const menu = {
    admin: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/projects", label: "Projects" },
      { to: "/tasks", label: "Tasks" },
      { to: "/users", label: "Users" },
    ],
    projectManager: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/projects", label: "Projects" },
      { to: "/tasks", label: "Tasks" },
    ],
    employee: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/tasks", label: "My Tasks" },
    ],
    client: [{ to: "/client/portal", label: "Client Portal" }],
  };

  return (
    <div className="sticky top-0 w-64 h-screen p-5 bg-white shadow-md">
      <h2 className="mb-6 text-xl font-bold">PM dashboard</h2>
      <nav className="space-y-3">
        {menu[role]?.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block p-3 rounded-lg
                            ${
                              location.pathname === item.to
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                            }
                            `}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
