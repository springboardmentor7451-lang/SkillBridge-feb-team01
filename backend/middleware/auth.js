import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

/**
 * Socket.io JWT Authentication Middleware
 * Extracts token from socket.handshake.auth.token, verifies it,
 * and attaches the user object to socket.user.
 */
export const verifySocketToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket for downstream use
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

/**
 * Authorization Check: Can two users message each other?
 *
 * Rules:
 * - One must be a volunteer and the other an NGO
 * - There must be an accepted application where:
 *     • The volunteer applied to an opportunity created by the NGO
 *
 * @param {string} userId1 - First user's ID
 * @param {string} userId2 - Second user's ID
 * @returns {Promise<boolean>} - Whether messaging is allowed
 */
export const canMessage = async (userId1, userId2) => {
  try {
    // Fetch both users in parallel
    const [user1, user2] = await Promise.all([
      User.findById(userId1).select("role").lean(),
      User.findById(userId2).select("role").lean(),
    ]);

    if (!user1 || !user2) return false;

    // Determine which is volunteer and which is NGO
    let volunteerId, ngoId;

    if (user1.role === "volunteer" && user2.role === "ngo") {
      volunteerId = userId1;
      ngoId = userId2;
    } else if (user1.role === "ngo" && user2.role === "volunteer") {
      volunteerId = userId2;
      ngoId = userId1;
    } else {
      // Same role — messaging not allowed
      return false;
    }

    // Find opportunities created by the NGO
    const ngoOpportunityIds = await Opportunity.find({ createdBy: ngoId })
      .select("_id")
      .lean();

    if (ngoOpportunityIds.length === 0) return false;

    const opportunityIds = ngoOpportunityIds.map((o) => o._id);

    // Check if the volunteer has an accepted application to any of these opportunities
    const acceptedApplication = await Application.findOne({
      volunteer_id: volunteerId,
      opportunity_id: { $in: opportunityIds },
      status: "accepted",
    }).lean();

    return !!acceptedApplication;
  } catch (error) {
    console.error("canMessage check failed:", error.message);
    return false;
  }
};
