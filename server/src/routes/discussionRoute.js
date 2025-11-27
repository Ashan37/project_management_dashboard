import express from "express";
import {
  createDiscussion,
  getDiscussionsByProject,
  getDiscussionsByTask,
  updateDiscussion,
  deleteDiscussion,
  addReaction,
} from "../controllers/discussionController.js";
import { protect } from "../middlewares/userMiddleware.js";

const router = express.Router();

// Create discussion
router.post("/", protect, createDiscussion);

// Get discussions by project
router.get("/project/:projectId", protect, getDiscussionsByProject);

// Get discussions by task
router.get("/task/:taskId", protect, getDiscussionsByTask);

// Update discussion
router.put("/:id", protect, updateDiscussion);

// Delete discussion
router.delete("/:id", protect, deleteDiscussion);

// Add/remove reaction
router.post("/:id/reaction", protect, addReaction);

export default router;
