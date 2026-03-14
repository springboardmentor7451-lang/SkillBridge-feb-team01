import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import Notification from "../models/Notification.js";

// @desc    Apply to an opportunity
// @route   POST /api/applications
// @access  Private (Volunteer only)
export const applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunity_id } = req.body;

    // Validate required field
    if (!opportunity_id) {
      return res.status(400).json({ message: "opportunity_id is required" });
    }

    // Check if the opportunity exists
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if the opportunity is still open
    if (opportunity.status !== "open") {
      return res
        .status(400)
        .json({ message: "This opportunity is no longer accepting applications" });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      opportunity_id,
      volunteer_id: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this opportunity" });
    }

    // Create the application
    const application = await Application.create({
      opportunity_id,
      volunteer_id: req.user._id,
      status: "pending",
    });

    // Notify the NGO about the new application
    await Notification.create({
      user: opportunity.createdBy,
      title: "New Application Received",
      message: `${req.user.name || "A volunteer"} applied for your opportunity: "${opportunity.title}"`
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications submitted by the logged-in volunteer
// @route   GET /api/applications/my
// @access  Private (Volunteer only)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      volunteer_id: req.user._id,
    })
      .populate({
        path: "opportunity_id",
        select: "title status createdBy",
        populate: {
          path: "createdBy",
          select: "organization_name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:id/status
// @access  Private (NGO only)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status value
    if (!status || !["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be either 'accepted' or 'rejected'" });
    }

    // Find the application and populate opportunity details
    const application = await Application.findById(req.params.id).populate(
      "opportunity_id"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify that the logged-in NGO owns the opportunity
    if (
      application.opportunity_id.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this application",
      });
    }

    // Update the application status
    application.status = status;
    await application.save();

    // Notify the volunteer about the status change
    await Notification.create({
      user: application.volunteer_id,
      title: "Application Update",
      message: `Your application for "${application.opportunity_id.title}" has been ${status}.`
    });

    res.status(200).json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    next(error);
  }
};
