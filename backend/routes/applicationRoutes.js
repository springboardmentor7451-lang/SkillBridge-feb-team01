import express from "express";
import { getNGOApplications } from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/ngo", protect, getNGOApplications);

export default router;