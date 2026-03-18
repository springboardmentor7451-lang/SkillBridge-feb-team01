import mongoose from "mongoose";

/**
 * Application Model
 * Tracks volunteer applications to opportunities.
 */
const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: [true, "Opportunity ID is required"],
    },

    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Volunteer ID is required"],
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications: one volunteer can apply once per opportunity
applicationSchema.index({ opportunity_id: 1, volunteer_id: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
