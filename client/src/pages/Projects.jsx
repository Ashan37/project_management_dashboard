import { useEffect, useState } from "react";
import { getProjects } from "../api/projectApi.js";
import ProjectCard from "../components/ProjectCard.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import CreateProjectModel from "../components/projects/CreateProjectModel.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1>Projects</h1>
        <button onClick={() => setOpenModel(true)}>Create New Project</button>
      </div>

      <div>
        {projects.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>

      <CreateProjectModel
        open={openModel}
        close={() => setOpenModel(false)}
        refresh={loadProjects}
      />
    </DashboardLayout>
  );
}
