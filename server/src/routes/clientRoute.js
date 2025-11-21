import express from "express";

import {
  getClientProjectById,
  getClientRequests,
  getClientRequestById,
  submitClientRequest,
} from "../controllers/clientController.js";

import { protect } from "../middlewares/userMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("client"));

router.get("/projects", getClientRequests);
router.get("/projects/:id", getClientProjectById);
router.post("/requests", submitClientRequest);
router.get("/requests/:id", getClientRequestById);

export default router;
