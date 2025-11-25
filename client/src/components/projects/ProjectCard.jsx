import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="p-6 bg-white shadow rounded-xl hover:shadow-lg trasition"
    >
      <h2 className="mb-2 text-xl font-bold">{project.name}</h2>
      <p className="mb-3 text-gray-600">
        {project.client?.name || "No Client"}
      </p>

      <div className="text-sm text-gray-500">
        <p>Status: {project.status}</p>
        <p>Deadline: {project.endDate?.slice(0, 10)}</p>
      </div>

      <div className="w-full h-2 mt-4 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-600 rounded-full"
          style={{ width: `${project.progress || 0}%` }}
        ></div>
      </div>
    </Link>
  );
}
