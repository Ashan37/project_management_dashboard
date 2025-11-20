import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  addSubtask,
  addComment,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middlewares/userMiddleware.js";
import { authorizeRoles } from "../middlewares/rolemiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "user"), createTask);

router.get("/project/:projectId", protect, getTasksByProject);

router.put("/:id", protect, updateTask);

router.put("/:id/status", protect, updateTaskStatus);

router.post("/:id/subtask", protect, addSubtask);

router.post("/:id/comment", protect, addComment);

router.delete("/:id", protect, deleteTask);
export default router;
