import { toEthiopian, toGregorian } from 'ethiopian-calendar-new';

/**
 * Formats a Gregorian date (Date object or ISO string) to Ethiopian date string (DD/MM/YYYY)
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatToEthiopian = (date, includeTime = false) => {
    if (!date) return '';
    let d;
    if (typeof date === 'string') {
        // Handle MySQL space instead of T
        const normalized = date.replace(' ', 'T');
        d = new Date(normalized);
    } else {
        d = new Date(date);
    }

    if (isNaN(d)) return '';

    const eth = toEthiopian(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const dateStr = `${eth.day}/${eth.month}/${eth.year}`;

    if (includeTime) {
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${dateStr} ${displayHours}:${displayMinutes} ${ampm}`;
    }

    return dateStr;
};

/**
 * Converts Ethiopian date parts into a Gregorian Date object
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @returns {Date}
 */
export const ethToGregorianDate = (year, month, day) => {
    const greg = toGregorian(year, month, day);
    return new Date(greg.year, greg.month - 1, greg.day);
};

/**
 * Converts a Gregorian date object/string to Ethiopian date object
 * @param {Date|string} date 
 */
export const getEthiopianParts = (date) => {
    if (!date) return null;
    let d;
    if (typeof date === 'string' && date.length === 10) {
        const [y, m, day] = date.split('-').map(Number);
        d = new Date(y, m - 1, day);
    } else {
        d = new Date(date);
    }

    if (isNaN(d)) return null;
    return toEthiopian(d.getFullYear(), d.getMonth() + 1, d.getDate());
};

/**
 * Normalizes a date string from UI (could be EC or GC) to standard GC ISO for DB
 * @param {string} dateStr 
 * @param {boolean} isEC 
 */
export const normalizeToGregorian = (dateStr, isEC) => {
    if (!dateStr) return null;
    if (!isEC) return new Date(dateStr).toISOString().split('T')[0];

    // Assuming format DD/MM/YYYY
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return null;

    const greg = toGregorian(year, month, day);
    // Month in toGregorian is likely 1-indexed based on search results
    const d = new Date(greg.year, greg.month - 1, greg.day);
    return d.toISOString().split('T')[0];
};

export const ETHIOPIAN_MONTHS = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yakatit',
    'Magabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagume'
];
