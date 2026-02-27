export const ngoOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "Access denied. NGO only." });
  }

  next();
};