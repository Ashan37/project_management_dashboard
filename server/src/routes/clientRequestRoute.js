import express from "express";
import {
  createClientRequest,
  getAllClientRequests,
  getMyClientRequests,
  getClientRequestsByProject,
  updateClientRequestStatus,
  deleteClientRequest,
} from "../controllers/clientRequestController.js";
import { protect } from "../middlewares/userMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Client can create and view their own requests
router.post("/", protect, createClientRequest);
router.get("/my-requests", protect, getMyClientRequests);

// Admin and manager can view all requests
router.get("/", protect, authorizeRoles("admin", "manager"), getAllClientRequests);

// Get requests by project
router.get("/project/:projectId", protect, getClientRequestsByProject);

// Admin and manager can update request status
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateClientRequestStatus);

// Admin can delete requests
router.delete("/:id", protect, authorizeRoles("admin"), deleteClientRequest);

export default router;
