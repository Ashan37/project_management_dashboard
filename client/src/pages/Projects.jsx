import { useEffect, useState } from "react";
import { getProjects } from "../api/projectApi.js";
import ProjectCard from "../components/ProjectCard.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import CreateProjectModel from "../components/projects/CreateProjectModel.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading projects...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Projects</h1>
        <button 
          onClick={() => setOpenModel(true)}
          className="w-full px-4 py-2 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3] sm:w-auto"
        >
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 col-span-full">
            No projects yet. Create your first project!
          </div>
        )}
      </div>

      <CreateProjectModel
        open={openModel}
        close={() => setOpenModel(false)}
        refresh={loadProjects}
      />
    </DashboardLayout>
  );
}
