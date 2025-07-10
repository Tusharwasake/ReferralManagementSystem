import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import {
  validateCandidateData,
  validateStatusUpdate,
  validateCandidateId,
  validatePaginationParams,
} from "../middleware/candidateValidation.js";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus,
  updateCandidate,
  deleteCandidate,
  getCandidateStats,
  downloadResume,
  upload,
} from "../controller/candidateController.js";

const router = express.Router();

// Public/Employee routes (All authenticated users can refer candidates)
router.post(
  "/",
  authenticateToken,
  upload.single("resume"),
  validateCandidateData,
  createCandidate
);
router.get("/", authenticateToken, validatePaginationParams, getAllCandidates);
router.get(
  "/stats",
  authenticateToken,
  getCandidateStats
);

// Specific routes before parameterized routes
router.get("/:id", authenticateToken, validateCandidateId, getCandidateById);
router.get(
  "/:id/resume",
  authenticateToken,
  validateCandidateId,
  downloadResume
);

// Update routes (HR and Admin can update status, Admin can update details)
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin", "HR"),
  validateCandidateId,
  validateStatusUpdate,
  updateCandidateStatus
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  validateCandidateId,
  updateCandidate
);

// Admin only routes
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  validateCandidateId,
  deleteCandidate
);

export default router;
