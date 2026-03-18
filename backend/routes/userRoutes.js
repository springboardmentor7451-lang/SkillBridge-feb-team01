import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET profile
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// ✅ PUT profile update (THIS WAS MISSING)
router.put("/profile", protect, async (req, res) => {
  try {
    const {
      organization_name,
      organization_description,
      website_url,
      location,
      bio,
      skills,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update only provided fields
    if (organization_name !== undefined) user.organization_name = organization_name;
    if (organization_description !== undefined) user.organization_description = organization_description;
    if (website_url !== undefined) user.website_url = website_url;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    const updatedUser = await user.save();

    // remove password before sending
    const { password, ...safeUser } = updatedUser.toObject();

    res.json(safeUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;