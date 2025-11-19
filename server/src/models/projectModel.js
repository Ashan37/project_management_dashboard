import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    client: { type: mongoose.Schema.Types.ObjectId },
    teamMembers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold"],
      default: "Not Started",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
