import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useState } from "react";
import { createProject } from "../../api/projectApi";

export default function CreateProjectModel({ open, close, refresh }) {
  const [form, setForm] = useState({
    name: "",
    client: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      await createProject(form);
      refresh();
      close();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-4">
          <input
            className="p-2 border rounded"
            placeholder="Project Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="p-2 border rounded"
            placeholder="Client Name"
            onChange={(e) => setForm({ ...form, client: e.target.value })}
          />

          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />

          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />

          <textarea
            className="p-2 border rounded"
            placeholder="Project Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
