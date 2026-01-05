// API Routes
export const API_ROUTES = {
    // Auth
    LOGIN: '/persons/email',

    // Admin
    ADMIN: {
        DASHBOARD_STATS: '/admin/dashboard/stats',
        REPORTS: '/admin/reports',
        GENERATE_REPORT: '/admin/reports/generate'
    },

    // Patients
    PATIENTS: '/patients',
    PATIENT_BY_ID: (id) => `/patients/${id}`,

    // Cards
    CARDS: '/cards',
    CARD_BY_ID: (id) => `/cards/${id}`,
    CARD_BY_NUMBER: (number) => `/cards/number/${number}`,
    CARDS_BY_PATIENT: (patientId) => `/cards/patient/${patientId}`,

    // Appointments
    APPOINTMENTS: '/appointments',
    APPOINTMENT_BY_ID: (id) => `/appointments/${id}`,
    APPOINTMENTS_BY_DOCTOR: (doctorId) => `/appointments/doctor/${doctorId}`,

    // Payments
    PAYMENTS: '/payments',
    PAYMENT_BY_ID: (id) => `/payments/${id}`,

    // Queue
    QUEUES: '/queues',
    QUEUE_BY_ID: (id) => `/queues/${id}`,
    QUEUES_BY_DOCTOR: (doctorId) => `/queues/doctor/${doctorId}`,

    // Doctors
    DOCTORS: '/doctors',
    DOCTOR_BY_ID: (id) => `/doctors/${id}`,

    // Lab Requests
    LAB_REQUESTS: '/lab-requests',
    LAB_REQUEST_BY_ID: (id) => `/lab-requests/${id}`,
    LAB_REQUESTS_BY_VISIT: (visitId) => `/lab-requests/visit/${visitId}`,

    // Lab Test Results
    LAB_TEST_RESULTS: '/lab-test-results',
    LAB_TEST_RESULTS_BY_REQUEST: (requestId) => `/lab-test-results/request/${requestId}`,

    // Patient Visit Records
    PATIENT_VISIT_RECORDS: '/patient-visit-records',
    PATIENT_VISIT_RECORD_BY_ID: (id) => `/patient-visit-records/${id}`,
    PATIENT_VISIT_RECORDS_BY_CARD: (cardId) => `/patient-visit-records/card/${cardId}`,

    // Visit Vital Signs
    VISIT_VITAL_SIGNS: '/visit-vital-signs',

    // Visit Physical Exams
    VISIT_PHYSICAL_EXAMS: '/visit-physical-exams',

    // Available Lab Tests
    AVAILABLE_LAB_TESTS: '/available-lab-tests',
    AVAILABLE_LAB_TEST_BY_ID: (id) => `/available-lab-tests/${id}`,
    // Family Planning
    FAMILY_PLANNING: {
        CATEGORIES: '/family-planning/categories',
        CARD: (cardId) => `/family-planning/cards/${cardId}`,
        CREATE_CARD: '/family-planning/cards',
        UPDATE_CARD: (id) => `/family-planning/cards/${id}`,
        VISITS: (cardId) => `/family-planning/visits/${cardId}`,
        CREATE_VISIT: '/family-planning/visits',
    }
};

// Card Status
export const CARD_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    EXPIRED: 'Expired',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Queue Status
export const QUEUE_STATUS = {
    WAITING: 'waiting',
    IN_CONSULTATION: 'in_consultation',
    COMPLETED: 'completed',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELLED: 'cancelled',
};

// Payment Types
export const PAYMENT_TYPES = {
    CARD_REGISTRATION: 'Card Registration',
    CARD_RENEWAL: 'Card Renewal',
    LAB_TEST: 'Lab Test',
    CONSULTATION: 'Consultation',
    OTHER: 'Other',
};

// Gender Options
export const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    // { value: 'Other', label: 'Other' },
];

// Lab Request Status
export const LAB_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
    API: 'yyyy-MM-dd',
    API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Card Expiry Warning (days)
export const CARD_EXPIRY_WARNING_DAYS = 30;

// Queue Warning Threshold
export const LOW_QUEUE_THRESHOLD = 3;

// Appointment Reminder Time (minutes)
export const APPOINTMENT_REMINDER_MINUTES = 15;
