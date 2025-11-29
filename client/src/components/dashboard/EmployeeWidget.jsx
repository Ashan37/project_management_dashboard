import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTasks } from "../../api/taskApi";

export default function EmployeeWidgets() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myTasks: 0,
    dueToday: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tasksRes = await getMyTasks();
        const tasks = tasksRes.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dueToday = tasks.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        }).length;

        const completed = tasks.filter(
          (task) => task.status === "Completed"
        ).length;

        setStats({
          myTasks: tasks.length,
          dueToday,
          completed,
        });
      } catch (error) {
        console.error("Error fetching employee stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white shadow rounded-xl animate-pulse">
            <div className="w-1/2 h-4 mb-2 bg-gray-200 rounded"></div>
            <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Widget
        title="My Tasks"
        value={stats.myTasks}
        onClick={() => navigate("/tasks")}
      />
      <Widget
        title="Due Today"
        value={stats.dueToday}
        onClick={() => navigate("/tasks")}
      />
      <Widget
        title="Completed"
        value={stats.completed}
        onClick={() => navigate("/tasks")}
      />
    </div>
  );
}

function Widget({ title, value, onClick }) {
  return (
    <div
      className="p-6 transition-shadow bg-white shadow cursor-pointer rounded-xl hover:shadow-lg"
      onClick={onClick}
    >
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-blue-600">Click to view tasks →</p>
    </div>
  );
}
