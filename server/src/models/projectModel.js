import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    teamMembers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["planning", "in-progress", "in-review", "completed", "on-hold"],
      default: "planning",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
