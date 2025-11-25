import { useState } from "react";
import TaskModal from "./TaskModal";

export default function TaskCard({ task, refresh }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="p-4 bg-white rounded shadow cursor-pointer hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <h4 className="font-semibold">{task.title}</h4>
        <p className="text-sm text-gray-500">{task.assignedTo?.name || "Unassigned"}</p>

        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            {/* optional progress using subtasks */}
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{
                width: `${calculateProgress(task)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {open && <TaskModal open={open} close={() => { setOpen(false); refresh(); }} task={task} />}
    </>
  );
}

function calculateProgress(task) {
  if (!task.subtasks || task.subtasks.length === 0) return task.status === "completed" ? 100 : 0;
  const done = task.subtasks.filter(s => s.isCompleted).length;
  return Math.round((done / task.subtasks.length) * 100);
}
