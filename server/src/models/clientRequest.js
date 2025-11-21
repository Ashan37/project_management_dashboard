import mongoose from "mongoose";

const clientRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-review", "accepted", "rejected", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    response: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ClientRequest", clientRequestSchema);
