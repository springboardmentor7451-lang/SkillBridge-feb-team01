import express from "express";
import { getMatchedOpportunities } from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/opportunities", protect, getMatchedOpportunities);

export default router;
