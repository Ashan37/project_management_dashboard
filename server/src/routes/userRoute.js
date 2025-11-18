import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route example
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default router;
