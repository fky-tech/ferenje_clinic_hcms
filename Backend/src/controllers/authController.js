import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Person from '../models/personModel.js';

class AuthController {
    /**
     * Login - Authenticate user and issue JWT token
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Missing credentials',
                    message: 'Email and password are required.'
                });
            }

            // Find user by email
            const user = await Person.findByEmail(email);

            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials',
                    message: 'Incorrect email or password.'
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: 'Invalid credentials',
                    message: 'Incorrect email or password.'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    person_id: user.person_id,
                    email: user.email,
                    role: user.role,
                    department_id: user.department_id
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '24h' }
            );

            // Generate refresh token
            const refreshToken = jwt.sign(
                { person_id: user.person_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
            );

            // Return success with token and user info (excluding password)
            res.status(200).json({
                message: 'Login successful',
                token,
                refreshToken,
                user: {
                    person_id: user.person_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    department_id: user.department_id,
                    lab_specialty: user.lab_specialty,
                    phone_number: user.phone_number
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed',
                message: 'An error occurred during login. Please try again.'
            });
        }
    }

    /**
     * Refresh Token - Issue new access token using refresh token
     */
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    error: 'Missing refresh token',
                    message: 'Refresh token is required.'
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

            // Get user
            const user = await Person.findById(decoded.person_id);

            if (!user) {
                return res.status(401).json({
                    error: 'User not found',
                    message: 'The refresh token is valid but the user no longer exists.'
                });
            }

            // Generate new access token
            const newToken = jwt.sign(
                {
                    person_id: user.person_id,
                    email: user.email,
                    role: user.role,
                    department_id: user.department_id
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '24h' }
            );

            res.status(200).json({
                message: 'Token refreshed successfully',
                token: newToken
            });
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(403).json({
                    error: 'Invalid refresh token',
                    message: 'The refresh token is invalid or expired. Please login again.'
                });
            }

            console.error('Token refresh error:', error);
            res.status(500).json({
                error: 'Token refresh failed',
                message: 'An error occurred while refreshing the token.'
            });
        }
    }

    /**
     * Get Current User - Return authenticated user's information
     */
    async getCurrentUser(req, res) {
        try {
            res.status(200).json({
                user: req.user
            });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({
                error: 'Failed to get user information',
                message: 'An error occurred while retrieving user information.'
            });
        }
    }

    /**
     * Change Password - Update user's password
     */
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.person_id;

            // Validate input
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    message: 'Current password and new password are required.'
                });
            }

            // Validate new password strength
            if (newPassword.length < 6) {
                return res.status(400).json({
                    error: 'Weak password',
                    message: 'New password must be at least 6 characters long.'
                });
            }

            // Get user
            const user = await Person.findById(userId);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found',
                    message: 'User account not found.'
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    error: 'Invalid current password',
                    message: 'The current password you entered is incorrect.'
                });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await Person.update(userId, {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: hashedPassword,
                address: user.address,
                phone_number: user.phone_number,
                department_id: user.department_id,
                role: user.role,
                lab_specialty: user.lab_specialty
            });

            res.status(200).json({
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                error: 'Password change failed',
                message: 'An error occurred while changing the password.'
            });
        }
    }
}

export default new AuthController();
