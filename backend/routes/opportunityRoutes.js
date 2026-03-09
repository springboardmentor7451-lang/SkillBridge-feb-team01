import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    validateCreate,
    validateUpdate,
    validateObjectId,
} from "../middleware/opportunityValidator.js";
import {
    createOpportunity,
    getMyOpportunities,
    updateOpportunity,
    deleteOpportunity,
} from "../controllers/opportunityController.js";

const router = express.Router();

// All routes require JWT auth + NGO role
router.use(protect, authorize("ngo"));

// POST /api/opportunities — Create a new opportunity
router.post("/", validateCreate, createOpportunity);

// GET /api/opportunities/my — Get all opportunities by logged-in NGO
router.get("/my", getMyOpportunities);

// PUT /api/opportunities/:id — Update an opportunity
router.put("/:id", validateObjectId, validateUpdate, updateOpportunity);

// DELETE /api/opportunities/:id — Delete an opportunity
router.delete("/:id", validateObjectId, deleteOpportunity);

export default router;
