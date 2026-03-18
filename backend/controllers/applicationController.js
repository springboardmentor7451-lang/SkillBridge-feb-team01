import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import Notification from "../models/Notification.js";

// APPLY TO OPPORTUNITY
export const applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunity_id } = req.body;

    if (!opportunity_id) {
      return res.status(400).json({ message: "opportunity_id is required" });
    }

    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.status !== "open") {
      return res
        .status(400)
        .json({ message: "This opportunity is no longer accepting applications" });
    }

    const existingApplication = await Application.findOne({
      opportunity_id,
      volunteer_id: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this opportunity" });
    }

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

// GET MY APPLICATIONS (Volunteer)
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

// UPDATE APPLICATION STATUS (Accept/Reject)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be either 'accepted' or 'rejected'" });
    }

    const application = await Application.findById(req.params.id).populate(
      "opportunity_id"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.opportunity_id.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this application",
      });
    }

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

// GET NGO APPLICATIONS
export const getNGOApplications = async (req, res, next) => {
    try {
        const opportunities = await Opportunity.find({
            createdBy: req.user._id,
        });

        const opportunityIds = opportunities.map(op => op._id);

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
