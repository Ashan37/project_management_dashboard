import { useState, useEffect } from 'react';
import { getMyProjects } from '../../api/projectApi';
import { getMyTasks } from '../../api/taskApi';

export default function ManagerWidgets() {
  const [stats, setStats] = useState({
    myProjects: 0,
    tasksInReview: 0,
    upcomingDeadlines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          getMyProjects(),
          getMyTasks(),
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        // Calculate upcoming deadlines (tasks due within 7 days)
        const now = new Date();
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingDeadlines = tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= now && dueDate <= sevenDaysLater;
        }).length;

        // Tasks in review (status "In Progress")
        const tasksInReview = tasks.filter(task => task.status === "In Progress").length;

        setStats({
          myProjects: projects.length,
          tasksInReview,
          upcomingDeadlines,
        });
      } catch (error) {
        console.error("Error fetching manager stats:", error);
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
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Widget title="My Projects" value={stats.myProjects} />
      <Widget title="Tasks In Review" value={stats.tasksInReview} />
      <Widget title="Upcoming Deadlines" value={stats.upcomingDeadlines} />
    </div>
  );
}

function Widget({ title, value }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
