import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/projectApi";
import DashboardLayout from "../components/layout/DashboardLayout";
import AssignTeam from "../components/projects/AssignTeam";
import ProjectSummary from "../components/projects/ProjectSummary";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const loadDetails = async () => {
    const res = await getProjectById(id);
    setProject(res.data.project);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  return (
    <DashboardLayout>
      {!project ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProjectSummary project={project} />
          <AssignTeam project={project} refresh={loadDetails} />
        </>
      )}
    </DashboardLayout>
  );
}
