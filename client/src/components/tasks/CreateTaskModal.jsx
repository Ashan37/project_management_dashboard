import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useState } from "react";
import { createTask } from "../../api/taskApi";

export default function CreateTaskModal({ open, close, projectId, refresh }) {
  const [form, setForm] = useState({
    project: projectId,
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "todo",
  });

  const handleSubmit = async () => {
    try {
      await createTask(form);
      refresh();
      close();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <div className="mt-3 space-y-3">
          <input
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 text-white bg-blue-600 rounded">Create</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
