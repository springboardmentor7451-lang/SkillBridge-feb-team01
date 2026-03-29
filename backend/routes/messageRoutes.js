import express from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/authMiddleware.js";
import { getConversation, getConversations } from "../controllers/messageController.js";

const router = express.Router();

// Rate limiter for message API: 60 requests per minute per IP
const messageApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all active conversations for logged-in user
 * @access  Private
 */
router.get("/conversations", protect, messageApiLimiter, getConversations);

/**
 * @route   GET /api/messages/:userId
 * @desc    Get conversation between logged-in user and :userId
 * @access  Private
 */
router.get("/:userId", protect, messageApiLimiter, getConversation);

export default router;
