import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
