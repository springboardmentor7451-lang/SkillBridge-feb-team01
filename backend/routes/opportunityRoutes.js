import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { ngoOnly } from "../middleware/ngoMiddleware.js";
import {
  createOpportunity,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";
import Opportunity from "../models/Opportunity.js";

const router = express.Router();

// @route   GET /api/opportunities
// @desc    Get all open opportunities (public)
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("createdBy", "organization_name")
      .sort({ createdAt: -1 });
    res.status(200).json(opportunities);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/opportunities/my
// @desc    Get opportunities created by logged-in NGO
// @access  Private (NGO only)
router.get("/my", protect, ngoOnly, getMyOpportunities);

// @route   POST /api/opportunities
// @desc    Create a new opportunity
// @access  Private (NGO only)
router.post("/", protect, ngoOnly, createOpportunity);

// @route   PUT /api/opportunities/:id
// @desc    Update an opportunity
// @access  Private (NGO only, owner)
router.put("/:id", protect, ngoOnly, updateOpportunity);

// @route   DELETE /api/opportunities/:id
// @desc    Delete an opportunity
// @access  Private (NGO only, owner)
router.delete("/:id", protect, ngoOnly, deleteOpportunity);

export default router;