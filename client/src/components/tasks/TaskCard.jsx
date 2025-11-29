import { useState } from "react";
import TaskModal from "./TaskModal";
import { useAuthStore } from "../../store/authStore";
import { updateTaskStatus } from "../../api/taskApi";

const STATUSES = ["To Do", "In Progress", "In Review", "Completed"];

export default function TaskCard({ task, refresh }) {
  const [open, setOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const { role, user } = useAuthStore();
  
  const isEmployee = role === "employee";
  
  // Check assignment - handle both object and string formats
  const taskAssignedId = typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo;
  const currentUserId = user?._id;
  const isAssignedToCurrentUser = taskAssignedId === currentUserId;
  
  // Check if employee has permission to change status (default true for backward compatibility)
  const allowEmployeeStatusChange = task.allowEmployeeStatusChange !== false;
  
  const canChangeStatus = role === "admin" || role === "manager" || 
                          (isAssignedToCurrentUser && allowEmployeeStatusChange);

  const handleClick = (e) => {
    // Open modal for everyone - admins, managers, and assigned employees
    if (role === "admin" || role === "manager" || (isEmployee && isAssignedToCurrentUser)) {
      setOpen(true);
    }
  };

  const handleStatusChange = async (e, newStatus) => {
    e.stopPropagation();
    try {
      await updateTaskStatus(task._id, newStatus);
      setShowStatusMenu(false);
      refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <div
        className="relative p-4 bg-white rounded shadow hover:shadow-md"
        onClick={handleClick}
        style={{ cursor: (role === "admin" || role === "manager" || (isEmployee && isAssignedToCurrentUser)) ? 'pointer' : 'default' }}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold">{task.title}</h4>
          
          {/* Status badge with dropdown for assigned employee */}
          <div className="relative">
            <span 
              className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                task.status === "To Do" ? "bg-gray-100 text-gray-800" :
                task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                task.status === "In Review" ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              } ${canChangeStatus ? 'hover:opacity-80' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (canChangeStatus) setShowStatusMenu(!showStatusMenu);
              }}
            >
              {task.status}
            </span>
            
            {/* Status dropdown menu */}
            {showStatusMenu && canChangeStatus && (
              <div className="absolute right-0 z-10 w-40 mt-1 bg-white border rounded shadow-lg">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={(e) => handleStatusChange(e, status)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                      task.status === status ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600">{task.assignedTo?.name || "Unassigned"}</p>
        
        {/* Priority and Due Date */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className={`px-2 py-1 rounded font-medium ${
            task.priority === "urgent" ? "bg-red-100 text-red-800" :
            task.priority === "high" ? "bg-orange-100 text-orange-800" :
            task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
            "bg-green-100 text-green-800"
          }`}>
            {task.priority?.toUpperCase() || "MEDIUM"}
          </span>
          {task.dueDate && (
            <span className={`px-2 py-1 rounded ${
              new Date(task.dueDate) < new Date() && task.status !== "Completed"
                ? "bg-red-100 text-red-800 font-semibold"
                : "bg-gray-100 text-gray-700"
            }`}>
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

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

      {/* Close status menu when clicking outside */}
      {showStatusMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowStatusMenu(false)}
        />
      )}

      {open && <TaskModal open={open} close={() => { setOpen(false); refresh(); }} task={task} />}
    </>
  );
}

function calculateProgress(task) {
  if (!task.subtasks || task.subtasks.length === 0) return task.status === "Completed" ? 100 : 0;
  const done = task.subtasks.filter(s => s.isCompleted).length;
  return Math.round((done / task.subtasks.length) * 100);
}
