import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { addComment, updateTask, toggleSubtask, uploadAttachment } from "../../api/taskApi";
import { useAuthStore } from "../../store/authStore";
import { useDropzone } from "react-dropzone";
import axios from "../../api/axiosConfig";

export default function TaskModal({ open, close, task }) {
  const [local, setLocal] = useState(task);
  const [commentText, setCommentText] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleAddComment = async () => {
    try {
      await addComment(local._id, commentText);
      // optimistic add (or reload tasks)
      setCommentText("");
      // you could reload via parent refresh
    } catch (err) {
      console.error(err);
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

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <DialogTitle>{local.title}</DialogTitle>
      <DialogContent>
        <div className="space-y-4">
          <textarea
            value={local.description || ""}
            onChange={(e) => setLocal({ ...local, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
          />

          <div>
            <h4 className="mb-2 font-semibold">Subtasks</h4>
            <div className="space-y-2">
              {(local.subtasks || []).map((s) => (
                <div key={s._id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={s.isCompleted}
                    onChange={async () => {
                      try {
                        await toggleSubtask(local._id, s._id);
                        // simple flip in UI
                        setLocal((prev) => ({
                          ...prev,
                          subtasks: prev.subtasks.map((x) =>
                            x._id === s._id ? { ...x, isCompleted: !x.isCompleted } : x
                          ),
                        }));
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Attachments</h4>
            <div {...getRootProps()} className="py-4 text-center border-2 border-gray-300 border-dashed rounded cursor-pointer">
              <input {...getInputProps()} />
              {uploading ? "Uploading..." : "Drag & drop files here, or click to upload"}
            </div>

            <div className="mt-3 space-y-2">
              {(local.attachments || []).map((a, i) => (
                <div key={i} className="flex items-center justify-between">
                  <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600">
                    {a.fileName || "attachment"}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Comments</h4>
            <div className="space-y-3">
              {(local.comments || []).map((c) => (
                <div key={c._id} className="p-3 rounded bg-gray-50">
                  <div className="text-sm text-gray-600">{c.user?.name || "User"}</div>
                  <div>{c.message}</div>
                  <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Write a comment..."
                />
                <button onClick={handleAddComment} className="px-4 py-2 text-white bg-blue-600 rounded">Send</button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            <button onClick={handleSave} className="px-4 py-2 text-white bg-green-600 rounded">Save</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
