import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/projectApi";
import { getTasksByProject } from "../api/taskApi";
import DashboardLayout from "../components/layout/DashboardLayout";
import AssignTeam from "../components/projects/AssignTeam";
import ProjectSummary from "../components/projects/ProjectSummary";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DiscussionThread from "../components/communication/DiscussionThread";
import { useAuthStore } from "../store/authStore";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { role } = useAuthStore();

  const loadDetails = async () => {
    const res = await getProjectById(id);
    setProject(res.data.project);
  };

  const loadTasks = async () => {
    try {
      const res = await getTasksByProject(id);
      setTasks(res.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useEffect(() => {
    loadDetails();
    loadTasks();
  }, [id]);

  const handleTaskCreated = () => {
    loadTasks();
    setShowTaskModal(false);
  };

  return (
    <DashboardLayout>
      {!project ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProjectSummary project={project} />
          
          {(role === "admin" || role === "manager") && (
            <AssignTeam project={project} refresh={loadDetails} />
          )}

          {/* Tasks Section */}
          <div className="p-6 mt-6 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Project Tasks</h2>
              {(role === "admin" || role === "manager") && (
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
                >
                  Create Task
                </button>
              )}
            </div>

            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks created yet</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === "To Do" ? "bg-gray-100 text-gray-800" :
                            task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                            task.status === "In Review" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {task.status}
                          </span>
                          {task.assignedTo && (
                            <span className="text-gray-600">
                              Assigned to: {task.assignedTo.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="text-gray-600">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discussion Thread */}
          <div className="mt-6">
            <h2 className="mb-4 text-xl font-bold">Project Discussion</h2>
            <DiscussionThread projectId={id} />
          </div>

          {showTaskModal && (
            <CreateTaskModal
              open={showTaskModal}
              close={() => setShowTaskModal(false)}
              projectId={id}
              refresh={handleTaskCreated}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
