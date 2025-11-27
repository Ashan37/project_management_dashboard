import express from "express";

import {
  getClientProjectById,
  getClientRequests,
  getClientRequestById,
  submitClientRequest,
  getAllClients,
} from "../controllers/clientController.js";

import { protect } from "../middlewares/userMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Get all clients (for admins/managers to select when creating projects)
router.get("/", protect, authorizeRoles("admin", "manager"), getAllClients);

// Client-specific routes
router.use(protect, authorizeRoles("client"));

router.get("/projects", getClientRequests);
router.get("/projects/:id", getClientProjectById);
router.post("/requests", submitClientRequest);
router.get("/requests/:id", getClientRequestById);

export default router;
