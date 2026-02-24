import mongoose from "mongoose";

/**
 * Validate that req.params.id is a valid MongoDB ObjectId.
 */
export const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid opportunity ID format" });
    }
    next();
};

/**
 * Validate required fields for creating an opportunity.
 */
export const validateCreate = (req, res, next) => {
    const errors = [];
    const { title, description, skillsRequired, location } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("Title is required");
    }
    if (!description || typeof description !== "string" || !description.trim()) {
        errors.push("Description is required");
    }
    if (
        !skillsRequired ||
        !Array.isArray(skillsRequired) ||
        skillsRequired.length === 0
    ) {
        errors.push("skillsRequired must be a non-empty array of strings");
    }
    if (!location || typeof location !== "string" || !location.trim()) {
        errors.push("Location is required");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    // Sanitize — trim strings
    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.location = location.trim();
    if (req.body.duration && typeof req.body.duration === "string") {
        req.body.duration = req.body.duration.trim();
    }

    next();
};

/**
 * Validate & whitelist fields for updating an opportunity.
 * Strips any disallowed fields (especially createdBy).
 */
export const validateUpdate = (req, res, next) => {
    const allowedFields = [
        "title",
        "description",
        "skillsRequired",
        "location",
        "duration",
        "status",
    ];

    // Strip disallowed fields
    const sanitized = {};
    for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
            sanitized[key] = req.body[key];
        }
    }

    // Trim string values
    for (const key of ["title", "description", "location", "duration"]) {
        if (sanitized[key] && typeof sanitized[key] === "string") {
            sanitized[key] = sanitized[key].trim();
        }
    }

    // Validate status enum if provided
    if (sanitized.status && !["open", "closed"].includes(sanitized.status)) {
        return res
            .status(400)
            .json({ message: "Status must be either 'open' or 'closed'" });
    }

    // Validate skillsRequired if provided
    if (
        sanitized.skillsRequired !== undefined &&
        (!Array.isArray(sanitized.skillsRequired) ||
            sanitized.skillsRequired.length === 0)
    ) {
        return res
            .status(400)
            .json({ message: "skillsRequired must be a non-empty array" });
    }

    if (Object.keys(sanitized).length === 0) {
        return res
            .status(400)
            .json({ message: "No valid fields provided for update" });
    }

    req.body = sanitized;
    next();
};
