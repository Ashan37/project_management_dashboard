import { useAuthStore } from "../../store/authStore";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  const menu = {
    admin: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/projects", label: "Projects" },
      { to: "/tasks", label: "Tasks" },
      { to: "/users", label: "Users" },
      { to: "/client-requests", label: "Client Requests" },
    ],
    manager: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/projects", label: "Projects" },
      { to: "/tasks", label: "Tasks" },
      { to: "/client-requests", label: "Client Requests" },
    ],
    employee: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/tasks", label: "My Tasks" },
    ],
    client: [{ to: "/client/portal", label: "Client Portal" }],
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:sticky top-0 left-0 z-30 w-64 h-screen p-5 bg-white shadow-md transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">PM Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-600 lg:hidden hover:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="space-y-3">
          {menu[role]?.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`block p-3 rounded-lg transition-colors ${
                location.pathname === item.to
                  ? "bg-[#82BAC4] text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
