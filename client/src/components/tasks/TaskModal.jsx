import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import {
  addComment,
  updateTask,
  toggleSubtask,
  uploadAttachment,
  updateTaskStatus,
  addSubtask,
} from "../../api/taskApi";
import { useAuthStore } from "../../store/authStore";
import { useDropzone } from "react-dropzone";
import axios from "../../api/axiosConfig";
import DiscussionThread from "../communication/DiscussionThread";

const STATUSES = ["To Do", "In Progress", "In Review", "Completed"];

export default function TaskModal({ open, close, task }) {
  const [local, setLocal] = useState(task);
  const [commentText, setCommentText] = useState("");
  const [subtaskText, setSubtaskText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const { user, role } = useAuthStore();

  useEffect(() => {
    setLocal(task);
  }, [task]);

  const handleSave = async () => {
    try {
      await updateTask(local._id, local);
      close();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await updateTaskStatus(local._id, newStatus);
      setLocal({ ...local, status: newStatus });
      // Refresh parent to show updated status
      if (close) {
        setTimeout(() => {
          close();
        }, 500);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await addComment(local._id, commentText);
      setLocal(response.data);
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskText.trim()) return;
    try {
      const response = await addSubtask(local._id, { title: subtaskText });
      setLocal(response.data);
      setSubtaskText("");
    } catch (err) {
      console.error(err);
      alert("Failed to add subtask: " + (err.response?.data?.message || err.message));
    }
  };

  const onDrop = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", files[0]);
      // use uploadAttachment or direct axios
      const res = await axios.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // res.data should include fileUrl and fileName
      const attachment = res.data;
      // append to task attachments via updateTask
      const updatedAttachments = [...(local.attachments || []), attachment];
      setLocal({ ...local, attachments: updatedAttachments });
      await updateTask(local._id, { attachments: updatedAttachments });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Check if current user is assigned to this task
  const isAssignedToCurrentUser = task.assignedTo?._id === user?._id;
  const isEmployee = role === "employee";
  
  // Check if employee has permission to change status (default true for backward compatibility)
  const allowEmployeeStatusChange = task.allowEmployeeStatusChange !== false;
  
  // Employees can change status if assigned and have permission
  const canChangeStatus =
    role === "admin" || 
    role === "manager" || 
    (isAssignedToCurrentUser && allowEmployeeStatusChange);
  
  // Employees can add comments and subtasks, but cannot edit description or upload files
  const canEditDetails = role === "admin" || role === "manager";

  // Full task modal for everyone with appropriate permissions
  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold">{local.title}</span>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              local.status === "To Do"
                ? "bg-gray-100 text-gray-800"
                : local.status === "In Progress"
                ? "bg-blue-100 text-blue-800"
                : local.status === "In Review"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {local.status}
          </span>
        </div>
        
        {/* Task Meta Information */}
        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-3">
          <div>
            <span className="font-semibold">Assigned to: </span>
            <span>{local.assignedTo?.name || "Unassigned"}</span>
          </div>
          <div>
            <span className="font-semibold">Priority: </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              local.priority === "urgent" ? "bg-red-100 text-red-800" :
              local.priority === "high" ? "bg-orange-100 text-orange-800" :
              local.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
            }`}>
              {local.priority?.toUpperCase() || "MEDIUM"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Due Date: </span>
            <span className={local.dueDate && new Date(local.dueDate) < new Date() && local.status !== "Completed" ? "text-red-600 font-semibold" : ""}>
              {local.dueDate ? new Date(local.dueDate).toLocaleDateString() : "Not set"}
            </span>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4">
          {/* Status Change Section */}
          {canChangeStatus && (
            <div>
              <h4 className="mb-2 font-semibold">Change Status</h4>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={local.status === status}
                    className={`px-4 py-2 rounded transition-colors ${
                      local.status === status
                        ? "bg-[#82BAC4] text-white cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employee Permission Control - Only for admins/managers */}
          {canEditDetails && (
            <div className="p-4 border rounded bg-blue-50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={local.allowEmployeeStatusChange !== false}
                  onChange={(e) => setLocal({ ...local, allowEmployeeStatusChange: e.target.checked })}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-gray-800">
                    Allow assigned employee to change task status
                  </span>
                  <p className="text-xs text-gray-600">
                    When enabled, the assigned employee can update status via dropdown or drag-and-drop
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Priority and Due Date - Editable by admins/managers */}
          {canEditDetails && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold">Priority</label>
                <select
                  value={local.priority || "medium"}
                  onChange={(e) => setLocal({ ...local, priority: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Due Date</label>
                <input
                  type="date"
                  value={local.dueDate ? new Date(local.dueDate).toISOString().split('T')[0] : ""}
                  onChange={(e) => setLocal({ ...local, dueDate: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Description - Read only for employees */}
          <div>
            <h4 className="mb-2 font-semibold">Description</h4>
            {canEditDetails ? (
              <textarea
                value={local.description || ""}
                onChange={(e) =>
                  setLocal({ ...local, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={4}
              />
            ) : (
              <div className="p-3 bg-gray-50 border rounded">
                <p className="text-sm text-gray-700">{local.description || "No description provided"}</p>
              </div>
            )}
          </div>

          {/* Subtasks - Employees can toggle completion */}
          <div>
            <h4 className="mb-2 font-semibold">Subtasks</h4>
            <div className="space-y-2">
              {(local.subtasks || []).length > 0 ? (
                (local.subtasks || []).map((s) => (
                  <div key={s._id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={s.isCompleted}
                      onChange={async () => {
                        if (canChangeStatus) {
                          try {
                            await toggleSubtask(local._id, s._id);
                            setLocal((prev) => ({
                              ...prev,
                              subtasks: prev.subtasks.map((x) =>
                                x._id === s._id
                                  ? { ...x, isCompleted: !x.isCompleted }
                                  : x
                              ),
                            }));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      disabled={!canChangeStatus}
                      className="cursor-pointer"
                    />
                    <span className={s.isCompleted ? "line-through text-gray-500" : ""}>{s.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No subtasks added</p>
              )}
            </div>
            
            {/* Add New Subtask - Available to admins, managers, and assigned employees */}
            {canChangeStatus && (
              <div className="flex gap-2 mt-3">
                <input
                  value={subtaskText}
                  onChange={(e) => setSubtaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="flex-1 p-2 text-sm border rounded"
                  placeholder="Add a new subtask..."
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-4 py-2 text-sm text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Attachments - View only for employees */}
          {canEditDetails && (
            <div>
              <h4 className="mb-2 font-semibold">Attachments</h4>
              <div
                {...getRootProps()}
                className="py-4 text-center border-2 border-gray-300 border-dashed rounded cursor-pointer"
              >
                <input {...getInputProps()} />
                {uploading
                  ? "Uploading..."
                  : "Drag & drop files here, or click to upload"}
              </div>
            </div>
          )}

          {(local.attachments || []).length > 0 && (
            <div>
              {!canEditDetails && <h4 className="mb-2 font-semibold">Attachments</h4>}
              <div className="mt-3 space-y-2">
                {(local.attachments || []).map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <a
                      href={a.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📎 {a.fileName || "attachment"}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-2 font-semibold">Comments</h4>
            <div className="space-y-3">
              {(local.comments || []).map((c) => (
                <div key={c._id} className="p-3 rounded bg-gray-50">
                  <div className="text-sm text-gray-600">
                    {c.user?.name || "User"}
                  </div>
                  <div>{c.message}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  className="flex-1 p-2 border rounded"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Discussion Tab */}
          <div>
            <button
              onClick={() => setShowDiscussion(!showDiscussion)}
              className="flex items-center gap-2 mb-3 text-[#82BAC4] hover:text-[#6DA8B3] font-semibold"
            >
              <span>{showDiscussion ? '▼' : '▶'}</span>
              <span>Discussion Thread ({showDiscussion ? 'Hide' : 'Show'})</span>
            </button>
            
            {showDiscussion && local.project && (
              <div className="mt-3">
                <DiscussionThread 
                  projectId={local.project} 
                  taskId={local._id}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={close}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
            {canChangeStatus && (
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
