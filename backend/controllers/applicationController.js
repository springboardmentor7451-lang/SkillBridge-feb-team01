import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

// @desc Get all applications for NGO opportunities
// @route GET /api/applications/ngo
// @access Private (NGO)
export const getNGOApplications = async (req, res, next) => {
    try {

        // find opportunities created by this NGO
        const opportunities = await Opportunity.find({
            createdBy: req.user._id,
        });

        const opportunityIds = opportunities.map(op => op._id);

        // find applications for those opportunities
        const applications = await Application.find({
            opportunity: { $in: opportunityIds },
        })
        .populate("volunteer", "name email")
        .populate("opportunity", "title");

        res.status(200).json(applications);

    } catch (error) {
        next(error);
    }
};