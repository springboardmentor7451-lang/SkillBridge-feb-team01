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

// Helper to safely build a case-insensitive RegExp from user input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// @route   GET /api/opportunities
// @desc    Get all open opportunities (public) with optional filters
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const { skill, location, search } = req.query;

    const filter = {};

    if (skill) {
      // Exact match for skill in skillsRequired array
      filter.skillsRequired = { $in: [skill] };
    }

    if (location) {
      const regex = new RegExp(escapeRegex(location), "i");
      filter.location = { $regex: regex };
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    const opportunities = await Opportunity.find(filter)
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