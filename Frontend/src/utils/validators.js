// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation (Ethiopian format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+251|0)[79]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Required field validation
export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} is required`;
    }
    return null;
};

// Patient Form Validation
export const validatePatientForm = (data) => {
    const errors = {};

    // Required fields
    if (!data.FirstName || data.FirstName.trim() === '') {
        errors.FirstName = 'First name is required';
    }

    if (!data.DateOfBirth) {
        errors.DateOfBirth = 'Date of birth is required';
    }

    if (!data.Sex) {
        errors.Sex = 'Gender is required';
    }

    // Phone number if provided
    if (data.PhoneNo && !isValidPhone(data.PhoneNo)) {
        errors.PhoneNo = 'Invalid phone number format';
    }

    return errors;
};

// Card Form Validation
export const validateCardForm = (data) => {
    const errors = {};

    if (!data.patient_id) {
        errors.patient_id = 'Patient is required';
    }

    if (!data.CardNumber || data.CardNumber.trim() === '') {
        errors.CardNumber = 'Card number is required';
    }

    if (!data.issue_date) {
        errors.issue_date = 'Issue date is required';
    }

    return errors;
};

// Payment Form Validation
export const validatePaymentForm = (data) => {
    const errors = {};

    if (!data.card_id) {
        errors.card_id = 'Card is required';
    }

    if (!data.amount || data.amount <= 0) {
        errors.amount = 'Valid amount is required';
    }

    if (!data.payment_type) {
        errors.payment_type = 'Payment type is required';
    }

    return errors;
};

// Appointment Form Validation
export const validateAppointmentForm = (data) => {
    const errors = {};

    if (!data.card_id) {
        errors.card_id = 'Patient card is required';
    }

    if (!data.doctor_id) {
        errors.doctor_id = 'Doctor is required';
    }

    if (!data.appointment_date) {
        errors.appointment_date = 'Appointment date is required';
    }

    return errors;
};

// Queue Form Validation
export const validateQueueForm = (data) => {
    const errors = {};

    if (!data.card_id) {
        errors.card_id = 'Patient card is required';
    }

    if (!data.doctor_id) {
        errors.doctor_id = 'Doctor is required';
    }

    return errors;
};

// Login Form Validation
export const validateLoginForm = (data) => {
    const errors = {};

    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!data.password || data.password.trim() === '') {
        errors.password = 'Password is required';
    }

    return errors;
};

// Check if object has any errors
export const hasErrors = (errors) => {
    return Object.keys(errors).length > 0;
};
