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

router.post("/", protect, createClientRequest);
router.get("/my-requests", protect, getMyClientRequests);

router.get("/", protect, authorizeRoles("admin", "manager"), getAllClientRequests);

router.get("/project/:projectId", protect, getClientRequestsByProject);

router.put("/:id", protect, authorizeRoles("admin", "manager"), updateClientRequestStatus);

router.delete("/:id", protect, authorizeRoles("admin"), deleteClientRequest);

export default router;
