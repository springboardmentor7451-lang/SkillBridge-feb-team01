import Opportunity from "../models/Opportunity.js";
import User from "../models/User.js";

// @desc Get matched opportunities for logged-in user
// @route GET /api/match/opportunities
// @access Private
export const getMatchedOpportunities = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const opportunities = await Opportunity.find();

    const matched = opportunities.map((op) => {
      const matchCount = op.skillsRequired.filter(skill =>
        user.skills.includes(skill)
      ).length;

      return {
        ...op._doc,
        matchScore: matchCount,
      };
    });

    // sort by highest match
    matched.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matched);
  } catch (error) {
    next(error);
  }
};
