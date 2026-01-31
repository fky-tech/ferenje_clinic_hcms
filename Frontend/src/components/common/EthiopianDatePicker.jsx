import { useState, useEffect } from 'react';
import { ETHIOPIAN_MONTHS, ethToGregorianDate, getEthiopianParts } from '../../utils/dateUtils';

export default function EthiopianDatePicker({ label, value, onChange, error, required, disabled, minDateToday }) {
    const [parts, setParts] = useState({
        day: 1,
        month: 1,
        year: 2016 // Default near current ET year
    });

    useEffect(() => {
        if (value) {
            const eth = getEthiopianParts(value);
            if (eth) {
                setParts({ day: eth.day, month: eth.month, year: eth.year });
            }
        } else {
            const ethToday = getEthiopianParts(new Date());
            if (ethToday) setParts(ethToday);
        }
    }, [value]);

    const ethToday = getEthiopianParts(new Date()) || { day: 1, month: 1, year: 2016 };

    const handlePartChange = (name, val) => {
        const newParts = { ...parts, [name]: parseInt(val) };
        setParts(newParts);

        // Convert to Gregorian and trigger onChange
        try {
            // Fix: Use local date components to avoid timezone shifts (off by one day)
            const gregDate = ethToGregorianDate(newParts.year, newParts.month, newParts.day);
            const year = gregDate.getFullYear();
            const month = String(gregDate.getMonth() + 1).padStart(2, '0');
            const day = String(gregDate.getDate()).padStart(2, '0');
            const iso = `${year}-${month}-${day}`;
            onChange({ target: { name: '', value: iso } }); // Simple mock event
        } catch (e) {
            console.error("Invalid ET date", e);
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="grid grid-cols-3 gap-2">
                <select
                    value={parts.day}
                    onChange={(e) => handlePartChange('day', e.target.value)}
                    disabled={disabled}
                    className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 outline-none ${disabled ? 'bg-gray-100 cursor-not-allowed appearance-none' : 'focus:border-blue-500'}`}
                >
                    {[...Array(30).keys()].map(i => {
                        const dayNum = i + 1;
                        let isDisabled = false;
                        if (minDateToday) {
                            if (parts.year < ethToday.year) isDisabled = true;
                            else if (parts.year === ethToday.year && parts.month < ethToday.month) isDisabled = true;
                            else if (parts.year === ethToday.year && parts.month === ethToday.month && dayNum < ethToday.day) isDisabled = true;
                        }
                        return (
                            <option key={dayNum} value={dayNum} disabled={isDisabled}>
                                {dayNum}
                            </option>
                        );
                    })}
                </select>
                <select
                    value={parts.month}
                    onChange={(e) => handlePartChange('month', e.target.value)}
                    disabled={disabled}
                    className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 outline-none ${disabled ? 'bg-gray-100 cursor-not-allowed appearance-none' : 'focus:border-blue-500'}`}
                >
                    {ETHIOPIAN_MONTHS.map((m, idx) => {
                        const monthNum = idx + 1;
                        let isDisabled = false;
                        if (minDateToday) {
                            if (parts.year < ethToday.year) isDisabled = true;
                            else if (parts.year === ethToday.year && monthNum < ethToday.month) isDisabled = true;
                        }
                        return (
                            <option key={monthNum} value={monthNum} disabled={isDisabled}>
                                {m}
                            </option>
                        );
                    })}
                </select>
                <input
                    type="number"
                    value={parts.year}
                    onChange={(e) => handlePartChange('year', e.target.value)}
                    disabled={disabled}
                    min={minDateToday ? ethToday.year : 0}
                    className={`w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 outline-none ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-blue-500'}`}
                    placeholder="Year"
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
