import mongoose from "mongoose";
import Message from "../models/Message.js";
import { canMessage } from "../middleware/auth.js";

/**
 * @desc    Get conversation between the logged-in user and another user
 * @route   GET /api/messages/:userId
 * @access  Private (JWT required)
 */
// export const getConversation = async (req, res) => {
//   try {
//     const currentUserId = req.user._id.toString();
//     const { userId } = req.params;

//     // Validate userId format
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     // Block fetching conversation with yourself
//     if (userId === currentUserId) {
//       return res.status(400).json({ message: "Cannot fetch conversation with yourself" });
//     }

//     // Authorization: check if these two users are allowed to message
//     const authorized = await canMessage(currentUserId, userId);
//     if (!authorized) {
//       return res.status(403).json({
//         message: "You are not authorized to view messages with this user",
//       });
//     }

//     // Fetch messages in both directions, sorted by timestamp ascending
//     const messages = await Message.find({
//       $or: [
//         { sender_id: currentUserId, receiver_id: userId },
//         { sender_id: userId, receiver_id: currentUserId },
//       ],
//     })
//       .sort({ timestamp: 1 })
//       .populate("sender_id", "name email role")
//       .populate("receiver_id", "name email role")
//       .lean();

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("getConversation error:", error.message);
//     res.status(500).json({ message: "Server error fetching messages" });
//   }
// };

export const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (userId === currentUserId) {
      return res.status(400).json({ message: "Cannot fetch conversation with yourself" });
    }

    const authorized = await canMessage(currentUserId, userId);
    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to view messages with this user",
      });
    }

    // ✅ Convert to ObjectId (optimization)
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    const otherUserObjectId = new mongoose.Types.ObjectId(userId);

    const messages = await Message.find({
      $or: [
        { sender_id: currentUserObjectId, receiver_id: otherUserObjectId },
        { sender_id: otherUserObjectId, receiver_id: currentUserObjectId },
      ],
    })
      .sort({ timestamp: 1 })
      .limit(100) // ✅ prevent huge data
      .select("sender_id receiver_id content timestamp") // ✅ optimize
      .populate("sender_id", "name email role")
      .populate("receiver_id", "name email role")
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("getConversation error:", error.message);
    res.status(500).json({ message: "Server error fetching messages" });
  }
};
