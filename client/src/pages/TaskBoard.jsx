import { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getTasksByProject,
  updateTaskStatus,
  createTask
} from "../api/taskApi";
import TaskCard from "../components/tasks/TaskCard";
import CreateTaskModel from "../components/tasks/CreateTaskModel";
import useSocket from "../hooks/useSocket";

const STATUSES = [
  { key: "todo", title: "To Do" },
  { key: "in-progress", title: "In Progress" },
  { key: "in-review", title: "In Review" },
  { key: "completed", title: "Completed" },
];

export default function TaskBoard() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const res = await getTasksByProject(projectId);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) loadTasks();
  }, [projectId, loadTasks]);

  // socket updates -> reload tasks
  useSocket(() => {
    loadTasks();
  });

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const taskId = draggableId;
    const newStatus = destination.droppableId;

    // optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTaskStatus(taskId, newStatus);
      // emit socket from backend or use axios to notify; backend should emit
    } catch (err) {
      console.error(err);
      loadTasks(); // revert on error
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kanban</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          + New Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {STATUSES.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded h-[70vh] overflow-auto"
                >
                  <h3 className="mb-3 font-semibold">{col.title}</h3>

                  {tasks
                    .filter((t) => t.status === col.key)
                    .map((task, index) => (
                      <Draggable draggableId={task._id} index={index} key={task._id}>
                        {(providedDr) => (
                          <div
                            ref={providedDr.innerRef}
                            {...providedDr.draggableProps}
                            {...providedDr.dragHandleProps}
                            className="mb-3"
                          >
                            <TaskCard task={task} refresh={loadTasks} />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal
        open={openCreate}
        close={() => setOpenCreate(false)}
        projectId={projectId}
        refresh={loadTasks}
      />
    </DashboardLayout>
  );
}
