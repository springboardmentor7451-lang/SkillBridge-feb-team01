/**
 * Role-based authorization middleware factory.
 * Must be used AFTER the `protect` (JWT auth) middleware.
 *
 * Usage: authorize("ngo") or authorize("ngo", "admin")
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "Not authorized, no user found" });
        }

        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: `Role '${req.user.role}' is not authorized to access this resource` });
        }

        next();
    };
};
