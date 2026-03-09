import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { ngoOnly } from "../middleware/ngoMiddleware.js";
import {
  createOpportunity,
  getAllOpportunities,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";

const router = express.Router();

// Public route
router.get("/", getAllOpportunities);

// NGO Protected routes
router.get("/my", protect, ngoOnly, getMyOpportunities);
router.post("/", protect, ngoOnly, createOpportunity);
router.put("/:id", protect, ngoOnly, updateOpportunity);
router.delete("/:id", protect, ngoOnly, deleteOpportunity);

export default router;