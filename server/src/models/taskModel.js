import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "In Review", "Completed"],
      default: "To Do",
    },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Permission control: whether assigned employee can change status
    allowEmployeeStatusChange: { type: Boolean, default: true },

    subtasks: [subtaskSchema],
    comments: [commentSchema],

    attachments: [{ fileName: String, fileUrl: String }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);