import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
{
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        required: true,
    },
    volunteer: {
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
{
    timestamps: true,
}
);

export default mongoose.model("Application", applicationSchema);