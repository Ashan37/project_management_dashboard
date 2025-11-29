import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getTasksByProject, updateTaskStatus } from "../api/taskApi";
import { getProjectById } from "../api/projectApi";
import TaskCard from "../components/tasks/TaskCard";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import useSocket from "../hooks/useSocket";
import { useAuthStore } from "../store/authStore";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const STATUSES = [
  { key: "To Do", title: "To Do" },
  { key: "In Progress", title: "In Progress" },
  { key: "In Review", title: "In Review" },
  { key: "Completed", title: "Completed" },
];

function DraggableTaskCard({ task, refresh, role }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.5 : 1,
  };

  const allowEmployeeStatusChange = task.allowEmployeeStatusChange !== false;

  const canDrag =
    role === "admin" ||
    role === "manager" ||
    (role === "employee" && allowEmployeeStatusChange);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(canDrag ? listeners : {})}
      className={canDrag ? "cursor-grab active:cursor-grabbing" : ""}
    >
      <TaskCard task={task} refresh={refresh} />
    </div>
  );
}

export default function TaskBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadTasks = useCallback(async () => {
    try {
      const res = await getTasksByProject(projectId);
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }, [projectId]);

  const loadProject = useCallback(async () => {
    try {
      const res = await getProjectById(projectId);
      setProject(res.data.project);
    } catch (err) {
      console.error("Error loading project:", err);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      Promise.all([loadTasks(), loadProject()]).finally(() =>
        setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, [projectId, loadTasks, loadProject]);

  useSocket(() => {
    loadTasks();
  });

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    const allowEmployeeStatusChange = task.allowEmployeeStatusChange !== false;
    const canChangeStatus =
      role === "admin" ||
      role === "manager" ||
      (role === "employee" && allowEmployeeStatusChange);

    if (!canChangeStatus) {
      alert(
        "You don't have permission to change this task's status. Contact your admin or manager."
      );
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTaskStatus(taskId, newStatus);
      await loadTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      alert(
        "Failed to update task status: " +
          (error.response?.data?.message || error.message)
      );
      await loadTasks();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!projectId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">No project selected</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="mb-2 text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Projects
          </button>
          <h1 className="text-2xl font-bold">
            {project ? project.name : "Kanban Board"}
          </h1>
          <p className="text-sm text-gray-600">Total Tasks: {tasks.length}</p>
        </div>
        {(role === "admin" || role === "manager") && (
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
          >
            + New Task
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STATUSES.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            return (
              <DroppableColumn
                key={col.key}
                id={col.key}
                title={col.title}
                tasks={columnTasks}
                loadTasks={loadTasks}
                role={role}
                user={user}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80">
              <TaskCard
                task={tasks.find((t) => t._id === activeId)}
                refresh={loadTasks}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={openCreate}
        close={() => setOpenCreate(false)}
        projectId={projectId}
        refresh={loadTasks}
      />
    </DashboardLayout>
  );
}

function DroppableColumn({ id, title, tasks, loadTasks, role, user }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded h-[70vh] overflow-auto"
    >
      <h3 className="mb-3 font-semibold text-gray-700">
        {title} ({tasks.length})
      </h3>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="p-4 text-center text-gray-400 border-2 border-gray-300 border-dashed rounded">
              <p className="text-sm">No tasks</p>
              <p className="mt-1 text-xs">Drop tasks here</p>
            </div>
          ) : (
            tasks.map((task) => (
              <DraggableTaskCard
                key={task._id}
                task={task}
                refresh={loadTasks}
                role={role}
                user={user}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
