import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  addSubtask,
  addComment,
  toggleSubtask,
  deleteTask,
  getMyTasks,
} from "../controllers/taskController.js";

import { protect } from "../middlewares/userMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager"), createTask);

router.get("/my-tasks", protect, getMyTasks);

router.get("/project/:projectId", protect, getTasksByProject);

router.put("/:id", protect, updateTask);

router.put("/:id/status", protect, updateTaskStatus);

router.post("/:id/subtask", protect, addSubtask);

router.post("/:id/comment", protect, addComment);

router.put("/:id/subtask/:subtaskId/toggle", protect, toggleSubtask);

router.delete("/:id", protect, deleteTask);
export default router;
