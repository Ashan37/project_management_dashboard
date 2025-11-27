import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
          {project.status || 'planning'}
        </span>
      </div>

      <p className="mb-4 text-gray-600 line-clamp-2">
        {project.description || 'No description provided'}
      </p>

      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm text-gray-500">
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 transition-all bg-[#82BAC4] rounded-full"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      {project.client && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">Client:</span> {project.client.name || project.client}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => navigate(`/projects/${project._id}`)}
          className="flex-1 px-3 py-2 text-sm md:text-base text-white transition-colors bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
        >
          View Details
        </button>
        <button
          onClick={() => navigate(`/projects/${project._id}/kanban`)}
          className="flex-1 px-3 py-2 text-sm md:text-base text-white transition-colors bg-[#5A9AA6] rounded hover:bg-[#4A8895]"
        >
          Kanban Board
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(project._id)}
            className="px-3 py-2 text-sm md:text-base text-white transition-colors bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
