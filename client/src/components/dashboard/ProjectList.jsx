export default function ProjectList() {
  const sampleProjects = [
    { name: "CRM App", status: "Active", progress: 70 },
    { name: "E-commerce Platform", status: "In Review", progress: 45 },
  ];

  return (
    <div className="p-6 mt-6 bg-white shadow rounded-xl">
      <h2 className="mb-4 text-xl font-bold">Projects</h2>

      {sampleProjects.map((p, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b"
        >
          <div>
            <h3 className="font-semibold">{p.name}</h3>
            <span className="text-sm text-gray-500">{p.status}</span>
          </div>

          <div className="w-40 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${p.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
