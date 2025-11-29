import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../../api/projectApi';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'text-yellow-600 bg-yellow-100',
      'in-progress': 'text-blue-600 bg-blue-100',
      'in-review': 'text-purple-600 bg-purple-100',
      'completed': 'text-green-600 bg-green-100',
      'on-hold': 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="p-6 mt-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-bold">Recent Projects</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="w-1/3 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-full h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-6 bg-white shadow rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Projects</h2>
        <button
          onClick={() => navigate('/projects')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All →
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between px-2 py-3 border-b rounded cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  {project.client && (
                    <span className="text-xs text-gray-500">
                      Client: {project.client.name || 'N/A'}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-40">
                <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#82BAC4] rounded-full transition-all"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">
          <p>No projects yet. Create your first project!</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 bg-[#82BAC4] text-white rounded hover:bg-[#6DA8B3]"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}
