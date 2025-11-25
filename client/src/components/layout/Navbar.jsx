import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const { user, role, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-full">
          {role}
        </span>

        <button
          onClick={logout}
          className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
