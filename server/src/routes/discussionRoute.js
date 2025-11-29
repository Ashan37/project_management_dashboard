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

router.post("/", protect, createDiscussion);

router.get("/project/:projectId", protect, getDiscussionsByProject);

router.get("/task/:taskId", protect, getDiscussionsByTask);

router.put("/:id", protect, updateDiscussion);

router.delete("/:id", protect, deleteDiscussion);

router.post("/:id/reaction", protect, addReaction);

export default router;
