import { useState, useEffect } from 'react';
import { getProjects } from '../../api/projectApi';
import { getClients } from '../../api/clientApi';
import instance from '../../api/axiosConfig';

export default function AdminWidget() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    totalClients: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch projects
      const projectsRes = await getProjects();
      const projects = projectsRes.data || [];
      
      // Fetch clients
      const clientsRes = await getClients();
      const clients = clientsRes.data || [];
      
      // Fetch all users
      const usersRes = await instance.get('/users');
      const users = usersRes.data || [];
      
      // Calculate active projects
      const activeProjects = projects.filter(
        p => p.status !== 'completed'
      ).length;
      
      setStats({
        totalProjects: projects.length,
        totalUsers: users.length,
        totalClients: clients.length,
        activeProjects: activeProjects,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <div className="p-6 bg-white shadow rounded-xl animate-pulse">
          <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="p-6 bg-white shadow rounded-xl animate-pulse">
          <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="p-6 bg-white shadow rounded-xl animate-pulse">
          <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="p-6 bg-white shadow rounded-xl animate-pulse">
          <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
      <Widget title="Total Projects" value={stats.totalProjects} color="blue" icon="📁" />
      <Widget title="Active Projects" value={stats.activeProjects} color="green" icon="🚀" />
      <Widget title="Team Members" value={stats.totalUsers} color="purple" icon="👥" />
      <Widget title="Clients" value={stats.totalClients} color="orange" icon="👤" />
    </div>
  );
}

function Widget({ title, value, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="p-6 transition-shadow bg-white shadow rounded-xl hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className={`text-2xl ${colorClasses[color]} p-2 rounded-lg`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
