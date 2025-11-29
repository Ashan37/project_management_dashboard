import { useState, useEffect } from 'react';
import { getMyProjects } from '../../api/projectApi';
import { getMyTasks } from '../../api/taskApi';

export default function ClientWidgets() {
  const [stats, setStats] = useState({
    projectProgress: 0,
    totalProjects: 0,
    completedTasks: 0,
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

        let avgProgress = 0;
        if (projects.length > 0) {
          const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
          avgProgress = Math.round(totalProgress / projects.length);
        }

        const completedTasks = tasks.filter(task => task.status === "Completed").length;

        setStats({
          projectProgress: avgProgress,
          totalProjects: projects.length,
          completedTasks,
        });
      } catch (error) {
        console.error("Error fetching client stats:", error);
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
      <Widget title="Avg Project Progress" value={`${stats.projectProgress}%`} />
      <Widget title="Total Projects" value={stats.totalProjects} />
      <Widget title="Completed Tasks" value={stats.completedTasks} />
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
