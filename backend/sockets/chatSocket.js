import mongoose from "mongoose";
import Message from "../models/Message.js";
import { verifySocketToken, canMessage } from "../middleware/auth.js";

/**
 * In-memory maps for online users and rate limiting.
 * userId (string) → socketId (string)
 */
const onlineUsers = new Map();

/**
 * Simple in-memory rate limiter.
 * userId → { count, resetTime }
 */
const rateLimiter = new Map();
const RATE_LIMIT_MAX = 30; // max messages per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Check if a user has exceeded the rate limit.
 * @param {string} userId
 * @returns {boolean} true if rate-limited
 */
const isRateLimited = (userId) => {
  const now = Date.now();
  const entry = rateLimiter.get(userId);

  if (!entry || now > entry.resetTime) {
    // Reset or create new window
    rateLimiter.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
};

/**
 * Initialize Socket.io chat system.
 * @param {import("socket.io").Server} io
 */
const initChatSocket = (io) => {
  // --- Socket.io Authentication Middleware ---
  io.use(verifySocketToken);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);
    console.log(`🟢 User connected: ${userId} (socket: ${socket.id})`);

    // ─── send_message Event ───────────────────────────────────
    socket.on("send_message", async (payload, callback) => {
      try {
        const { receiver_id, content } = payload || {};

        // --- Input Validation ---
        if (!content || typeof content !== "string" || !content.trim()) {
          return callback?.({ success: false, error: "Message content is required" });
        }

        if (!receiver_id) {
          return callback?.({ success: false, error: "Receiver ID is required" });
        }

        // Validate receiver_id format
        if (!mongoose.Types.ObjectId.isValid(receiver_id)) {
          return callback?.({ success: false, error: "Invalid receiver ID" });
        }

        // --- Block Self-Messaging ---
        if (receiver_id === userId) {
          return callback?.({ success: false, error: "Cannot send messages to yourself" });
        }

        // --- Rate Limiting ---
        if (isRateLimited(userId)) {
          return callback?.({
            success: false,
            error: "Rate limit exceeded. Please wait before sending more messages.",
          });
        }

        // --- Authorization Check ---
        const authorized = await canMessage(userId, receiver_id);
        if (!authorized) {
          return callback?.({
            success: false,
            error: "You are not authorized to message this user",
          });
        }

        // --- Duplicate Message Prevention (same content within 5 seconds) ---
        const fiveSecondsAgo = new Date(Date.now() - 5000);
        const duplicate = await Message.findOne({
          sender_id: userId,
          receiver_id,
          content: content.trim(),
          timestamp: { $gte: fiveSecondsAgo },
        }).lean();

        if (duplicate) {
          return callback?.({ success: false, error: "Duplicate message detected" });
        }

        // --- Sanitize & Save Message ---
        const sanitizedContent = content.trim().substring(0, 2000);

        const message = await Message.create({
          sender_id: userId,
          receiver_id,
          content: sanitizedContent,
        });

        // Populate sender info for the receiver
        const populatedMessage = await Message.findById(message._id)
          .populate("sender_id", "name email role")
          .populate("receiver_id", "name email role")
          .lean();

        // --- Emit to Receiver (if online) ---
        const receiverSocketId = onlineUsers.get(receiver_id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", populatedMessage);
        }
        // If receiver is offline, message is still persisted in DB

        // --- Acknowledge Sender ---
        callback?.({ success: true, message: populatedMessage });
      } catch (error) {
        console.error("send_message error:", error.message);
        callback?.({ success: false, error: "Failed to send message" });
      }
    });

    // ─── disconnect Event ─────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log(`🔴 User disconnected: ${userId}`);
    });
  });
};

export default initChatSocket;
