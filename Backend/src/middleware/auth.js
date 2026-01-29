import jwt from 'jsonwebtoken';
import Person from '../models/personModel.js';

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 * Attaches user information to request object
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Access denied. No token provided.',
                message: 'Please provide a valid authentication token in the Authorization header.'
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await Person.findById(decoded.person_id);

        if (!user) {
            return res.status(401).json({
                error: 'Access denied. User not found.',
                message: 'The token is valid but the user no longer exists.'
            });
        }

        // Attach user to request (excluding password)
        req.user = {
            person_id: user.person_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            department_id: user.department_id,
            lab_specialty: user.lab_specialty
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                error: 'Invalid token.',
                message: 'The provided token is malformed or invalid.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                error: 'Token expired.',
                message: 'Your session has expired. Please login again.'
            });
        }

        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication failed.',
            message: 'An error occurred while verifying your credentials.'
        });
    }
};

export default authenticate;
