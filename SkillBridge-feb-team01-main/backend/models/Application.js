import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        opportunity_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Opportunity",
            required: true,
        },

        volunteer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Prevent duplicate applications (one volunteer per opportunity)
applicationSchema.index({ opportunity_id: 1, volunteer_id: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
