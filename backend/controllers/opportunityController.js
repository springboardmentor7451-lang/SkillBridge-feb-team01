import Opportunity from "../models/Opportunity.js";

// CREATE OPPORTUNITY
export const createOpportunity = async (req, res, next) => {
    try {
        const { title, description, skillsRequired, location, duration } = req.body;

        const opportunity = await Opportunity.create({
            title,
            description,
            skillsRequired,
            location,
            duration,
            status: "open",
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Opportunity created successfully",
            opportunity,
        });
    } catch (error) {
        next(error);
    }
};

// GET MY OPPORTUNITIES
export const getMyOpportunities = async (req, res, next) => {
    try {
        const opportunities = await Opportunity.find({
            createdBy: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json(opportunities);
    } catch (error) {
        next(error);
    }
};

// UPDATE OPPORTUNITY
export const updateOpportunity = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        if (opportunity.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to update this opportunity",
            });
        }

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Opportunity updated successfully",
            opportunity: updatedOpportunity,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE OPPORTUNITY
export const deleteOpportunity = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        if (opportunity.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to delete this opportunity",
            });
        }

        await Opportunity.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Opportunity deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getOpportunityDetails = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!opportunity) {
            return res.status(404).json({
                message: "Opportunity not found",
            });
        }

        res.status(200).json(opportunity);
    } catch (error) {
        next(error);
    }
};