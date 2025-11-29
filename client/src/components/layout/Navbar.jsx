import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Project Manager';
      case 'employee':
        return 'Employee';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden sm:inline-block px-2 md:px-3 py-1 text-xs md:text-sm text-[#82BAC4] bg-[#E8F4F5] rounded-full">
          {getRoleLabel(role)}
        </span>
        <span className="text-sm text-gray-600 hidden md:block">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="px-2 md:px-3 py-1 md:py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
