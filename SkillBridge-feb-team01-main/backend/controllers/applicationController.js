import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

// @desc    Apply to an opportunity
// @route   POST /api/applications
// @access  Private (Volunteer only)
export const applyToOpportunity = async (req, res) => {
    try {
        const { opportunity_id } = req.body;

        // 1. Check if opportunity exists
        const opportunity = await Opportunity.findById(opportunity_id);
        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        // 2. Check if opportunity status is "open"
        if (opportunity.status !== "open") {
            return res
                .status(400)
                .json({ message: "This opportunity is no longer open for applications" });
        }

        // 3. Check if volunteer already applied to this opportunity
        const existingApplication = await Application.findOne({
            opportunity_id,
            volunteer_id: req.user._id,
        });

        if (existingApplication) {
            return res
                .status(400)
                .json({ message: "You have already applied to this opportunity" });
        }

        // 4. Create new application
        const application = await Application.create({
            opportunity_id,
            volunteer_id: req.user._id,
            status: "pending",
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all applications by the logged-in volunteer
// @route   GET /api/applications/my
// @access  Private (Volunteer only)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ volunteer_id: req.user._id })
            .populate({
                path: "opportunity_id",
                select: "title createdBy",
                populate: {
                    path: "createdBy",
                    select: "organization_name",
                },
            })
            .sort({ createdAt: -1 });

        // Map to the required response format
        const response = applications.map((app) => ({
            _id: app._id,
            opportunity_title: app.opportunity_id?.title || "N/A",
            ngo_name: app.opportunity_id?.createdBy?.organization_name || "N/A",
            status: app.status,
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:id/status
// @access  Private (NGO only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status value
        if (!["accepted", "rejected"].includes(status)) {
            return res
                .status(400)
                .json({ message: "Status must be 'accepted' or 'rejected'" });
        }

        // 1. Find application by ID and populate the opportunity
        const application = await Application.findById(req.params.id).populate(
            "opportunity_id"
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // 2. Verify that the NGO owns the opportunity
        if (
            application.opportunity_id.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized to update this application",
            });
        }

        // 3. Update application status
        application.status = status;
        await application.save();

        res.status(200).json({
            message: `Application ${status} successfully`,
            application,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all applicants for a specific opportunity (for NGO)
// @route   GET /api/applications/opportunity/:opportunityId
// @access  Private (NGO only)
export const getApplicantsForOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.params;

        // Verify the opportunity exists and belongs to this NGO
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        if (opportunity.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to view applicants for this opportunity",
            });
        }

        // Find all applications for this opportunity and populate volunteer info
        const applications = await Application.find({ opportunity_id: opportunityId })
            .populate("volunteer_id", "name email skills bio")
            .sort({ createdAt: -1 });

        const response = applications.map((app) => ({
            _id: app._id,
            name: app.volunteer_id?.name || "N/A",
            email: app.volunteer_id?.email || "N/A",
            skills: app.volunteer_id?.skills || [],
            bio: app.volunteer_id?.bio || "",
            status: app.status,
            appliedAt: app.createdAt,
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
