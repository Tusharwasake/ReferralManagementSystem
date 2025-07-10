import express from "express";
import {
  signup,
  login,
  logout,
  refreshToken,
} from "../controller/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.post("/logout", authenticateToken, logout);

export default router;
