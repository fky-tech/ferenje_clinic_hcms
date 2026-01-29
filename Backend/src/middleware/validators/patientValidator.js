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
 * Patient creation/update validation rules
 */
export const validatePatient = [
    body('FirstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('Father_Name')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Father name must not exceed 100 characters')
        .matches(/^[a-zA-Z\s'-]*$/)
        .withMessage('Father name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('GrandFather_Name')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Grandfather name must not exceed 100 characters')
        .matches(/^[a-zA-Z\s'-]*$/)
        .withMessage('Grandfather name can only contain letters, spaces, hyphens, and apostrophes')
        .escape(),

    body('DateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format. Use YYYY-MM-DD'),

    body('Age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be between 0 and 150'),

    body('Sex')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Sex must be one of: Male, Female, Other'),

    body('Region')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Region must not exceed 100 characters')
        .escape(),

    body('Wereda')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Wereda must not exceed 100 characters')
        .escape(),

    body('HouseNo')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('House number must not exceed 50 characters')
        .escape(),

    body('PhoneNo')
        .optional()
        .trim()
        .matches(/^[0-9+\-() ]+$/)
        .withMessage('Invalid phone number format')
        .escape(),

    validate
];
