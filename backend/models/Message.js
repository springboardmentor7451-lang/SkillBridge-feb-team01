import mongoose from "mongoose";

/**
 * Message Model
 * Stores chat messages between users (volunteer ↔ NGO).
 */
const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"],
  },

  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver is required"],
  },

   // ✅ ADD THIS (for milestone requirement)
  opportunity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opportunity",
    index: true,
  },

  content: {
    type: String,
    required: [true, "Message content is required"],
    trim: true,
    maxlength: [2000, "Message cannot exceed 2000 characters"],
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for fetching conversations between two users sorted by time
messageSchema.index({ sender_id: 1, receiver_id: 1, timestamp: 1 });

// Index for rate-limiting / duplicate detection queries
messageSchema.index({ sender_id: 1, timestamp: -1 });

export default mongoose.model("Message", messageSchema);
