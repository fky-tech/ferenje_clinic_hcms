/**
 * Role-Based Authorization Middleware
 * Restricts access based on user roles
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required.',
                message: 'You must be logged in to access this resource.'
            });
        }

        // Check if user's role is allowed
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Access forbidden.',
                message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${userRole}`
            });
        }

        next();
    };
};

export default authorize;
