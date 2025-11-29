import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useState, useEffect } from "react";
import { createTask } from "../../api/taskApi";
import instance from "../../api/axiosConfig";

export default function CreateTaskModal({ open, close, projectId, refresh }) {
  const [form, setForm] = useState({
    project: projectId,
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "To Do",
    priority: "medium",
    allowEmployeeStatusChange: true, // Default to true
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open, projectId]);

  const fetchEmployees = async () => {
    try {
      const res = await instance.get('/users');
      // Filter to show only employees and managers (people who can be assigned tasks)
      const filteredUsers = res.data.filter(user => 
        user.role === 'employee' || user.role === 'manager'
      );
      setEmployees(filteredUsers);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.title.trim()) {
        alert("Please enter a task title");
        return;
      }

      // Remove empty assignedTo field if not set
      const taskData = { ...form };
      if (!taskData.assignedTo) {
        delete taskData.assignedTo;
      }
      if (!taskData.dueDate) {
        delete taskData.dueDate;
      }
      
      await createTask(taskData);
      refresh();
      close();
      // Reset form
      setForm({
        project: projectId,
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "To Do",
        priority: "medium",
        allowEmployeeStatusChange: true,
      });
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <div className="mt-3 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter task title"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter task description"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Assign To
            </label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Select an employee (optional)</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email}) - {employee.role === 'manager' ? 'Project Manager' : 'Employee'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          {/* Employee Permission Control */}
          <div className="p-3 border rounded bg-blue-50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.allowEmployeeStatusChange}
                onChange={(e) => setForm({ ...form, allowEmployeeStatusChange: e.target.checked })}
                className="w-5 h-5 mt-1 text-blue-600 cursor-pointer"
              />
              <div>
                <span className="font-medium text-gray-800">
                  Allow assigned employee to change task status
                </span>
                <p className="text-xs text-gray-600">
                  When enabled, the assigned employee can update status via dropdown or drag-and-drop
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={close} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="px-4 py-2 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
              disabled={loading}
            >
              Create Task
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
