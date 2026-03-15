import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  applyToOpportunity,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// @route   POST /api/applications
// @desc    Volunteer applies to an opportunity
// @access  Private (Volunteer only)
router.post("/", protect, authorize("volunteer"), applyToOpportunity);

// @route   GET /api/applications/my
// @desc    Get all applications by the logged-in volunteer
// @access  Private (Volunteer only)
router.get("/my", protect, authorize("volunteer"), getMyApplications);

// @route   PUT /api/applications/:id/status
// @desc    NGO accepts or rejects an application
// @access  Private (NGO only)
router.put("/:id/status", protect, authorize("ngo"), updateApplicationStatus);

export default router;
