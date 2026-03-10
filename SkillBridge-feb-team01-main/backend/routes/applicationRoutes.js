import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    applyToOpportunity,
    getMyApplications,
    updateApplicationStatus,
    getApplicantsForOpportunity,
} from "../controllers/applicationController.js";

const router = express.Router();

// Volunteer routes
router.post("/", protect, authorize("volunteer"), applyToOpportunity);
router.get("/my", protect, authorize("volunteer"), getMyApplications);

// NGO routes
router.get("/opportunity/:opportunityId", protect, authorize("ngo"), getApplicantsForOpportunity);
router.put("/:id/status", protect, authorize("ngo"), updateApplicationStatus);

export default router;
