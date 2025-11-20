import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  addSubtask,
  deleteTask,
} from "../controllers/taskController.js";

import {protect} from '../middlewares/userMiddleware.js';
import {authorizeRoles} from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
    "/", protect, authorizeRoles('Admin', 'User'), createTask
);

router.get(
    "/project/:projectId", protect, authorizeRoles('Admin', 'User'), getTasksByProject
);
router.put(
    ""  
);