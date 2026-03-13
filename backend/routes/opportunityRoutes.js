import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { ngoOnly } from "../middleware/ngoMiddleware.js";

// TEMP controllers (replace when CRUD is implemented)
const createOpportunity = (req, res) => {
  res.json({ message: "Opportunity created successfully" });
};

const getAllOpportunities = (req, res) => {
  res.json({ message: "All opportunities fetched" });
};

const updateOpportunity = (req, res) => {
  res.json({ message: "Opportunity updated successfully" });
};

const deleteOpportunity = (req, res) => {
  res.json({ message: "Opportunity deleted successfully" });
};

const router = express.Router();

// Public route
router.get("/", getAllOpportunities);

// NGO Protected routes
router.post("/", protect, ngoOnly, createOpportunity);
router.put("/:id", protect, ngoOnly, updateOpportunity);
router.delete("/:id", protect, ngoOnly, deleteOpportunity);

export default router;