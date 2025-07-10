import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from "../controller/userController.js";

const router = express.Router();

// Get current user profile
router.get("/profile", authenticateToken, getUserProfile);

// Update current user profile
router.put("/profile", authenticateToken, updateUserProfile);

// Admin only routes
router.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);
router.get("/:id", authenticateToken, authorizeRoles("admin"), getUserById);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

export default router;
