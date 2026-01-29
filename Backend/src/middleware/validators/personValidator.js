import { body, validationResult } from 'express-validator';

/**
 * Validation middleware to check for validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }

    next();
};

/**
 * Person creation validation rules
 */
export const validateCreatePerson = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('First name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Last name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['admin', 'doctor', 'receptionist', 'lab_doctor'])
        .withMessage('Invalid role. Must be one of: admin, doctor, receptionist, lab_doctor'),

    body('phone_number')
        .optional()
        .trim()
        .matches(/^[0-9+\-() ]+$/)
        .withMessage('Invalid phone number format')
        .escape(),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
        .escape(),

    body('department_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Department ID must be a positive integer'),

    body('lab_specialty')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Lab specialty must not exceed 100 characters')
        .escape(),

    validate
];

/**
 * Person update validation rules
 */
export const validateUpdatePerson = [
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('First name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Last name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .optional()
        .isIn(['admin', 'doctor', 'receptionist', 'lab_doctor'])
        .withMessage('Invalid role. Must be one of: admin, doctor, receptionist, lab_doctor'),

    body('phone_number')
        .optional()
        .trim()
        .matches(/^[0-9+\-() ]+$/)
        .withMessage('Invalid phone number format')
        .escape(),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
        .escape(),

    body('department_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Department ID must be a positive integer'),

    body('lab_specialty')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Lab specialty must not exceed 100 characters')
        .escape(),

    validate
];
