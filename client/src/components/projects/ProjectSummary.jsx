export default function ProjectSummary({ project }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h1 className="mb-3 text-2xl font-bold">{project.name}</h1>

      <p className="mb-2 text-gray-600">{project.description}</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <p><strong>Client:</strong> {project.client?.name}</p>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Start Date:</strong> {project.startDate?.slice(0,10)}</p>
        <p><strong>End Date:</strong> {project.endDate?.slice(0,10)}</p>
      </div>

      <div className="mt-6">
        <p className="mb-2 font-semibold">Progress</p>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-green-600 rounded-full"
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
