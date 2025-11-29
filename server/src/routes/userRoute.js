import express from "express";
import { registerUser, loginUser, createUser } from "../controllers/userController.js";
import { protect } from "../middlewares/userMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", protect, authorizeRoles("admin"), createUser);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default router;
