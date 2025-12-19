import { format, parseISO, isToday, differenceInDays, addYears } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Date Formatting
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr);
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
};

export const formatDateTime = (date) => {
    return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
};

export const formatForAPI = (date) => {
    return formatDate(date, DATE_FORMATS.API);
};

export const formatDateTimeForAPI = (date) => {
    return formatDate(date, DATE_FORMATS.API_WITH_TIME);
};

export const isDateToday = (date) => {
    if (!date) return false;
    try {
        let dateObj;
        if (typeof date === 'string') {
            // Handle SQL format "YYYY-MM-DD HH:mm:ss"
            const normalized = date.replace(' ', 'T');
            dateObj = new Date(normalized);
        } else {
            dateObj = date;
        }
        return isToday(dateObj);
    } catch (error) {
        return false;
    }
};

// ID Generation
export const generatePatientId = () => {
    return `P${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

export const generateCardNumber = () => {
    const prefix = Math.floor(100000 + Math.random() * 900000).toString(); 
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
};

// Card Expiry
export const getCardExpiryDate = (issueDate = new Date()) => {
    return addYears(issueDate, 1);
};

export const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    try {
        const dateObj = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
        return differenceInDays(dateObj, new Date());
    } catch (error) {
        return null;
    }
};

export const isCardExpiringSoon = (expiryDate, warningDays = 30) => {
    const days = getDaysUntilExpiry(expiryDate);
    return days !== null && days >= 0 && days <= warningDays;
};

export const isCardExpired = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    return days !== null && days < 0;
};

// Name Formatting
export const getFullName = (patient) => {
    if (!patient) return '';
    const parts = [
        patient.FirstName,
        patient.Father_Name,
        patient.GrandFather_Name
    ].filter(Boolean);
    return parts.join(' ');
};

// Currency Formatting
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'ETB 0.00';
    return `ETB ${Number(amount).toFixed(2)}`;
};

// Phone Number Formatting
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Format Ethiopian phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+251 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
};

// Search Helpers
export const filterBySearchTerm = (items, searchTerm, searchFields) => {
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();
    return items.filter(item => {
        return searchFields.some(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return value?.toString().toLowerCase().includes(term);
        });
    });
};

// CSV Export
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (value === null || value === undefined) return '';
                const stringValue = value.toString();
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',')
        )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatForAPI(new Date())}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Calculate Age from Date of Birth
export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    try {
        const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age;
    } catch (error) {
        console.error('Age calculation error:', error);
        return null;
    }
};

// Storage Helpers
export const getStoredUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error retrieving user:', error);
        return null;
    }
};

export const setStoredUser = (user) => {
    try {
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error storing user:', error);
    }
};

export const clearStoredUser = () => {
    localStorage.removeItem('user');
};

export const logoutUser = () => {
    clearStoredUser();
};

// Search History
export const getSearchHistory = () => {
    try {
        const history = localStorage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error retrieving search history:', error);
        return [];
    }
};

export const addToSearchHistory = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;

    try {
        const history = getSearchHistory();
        const filtered = history.filter(term => term !== searchTerm);
        const updated = [searchTerm, ...filtered].slice(0, 10); // Keep last 10
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    } catch (error) {
        console.error('Error adding to search history:', error);
    }
};
