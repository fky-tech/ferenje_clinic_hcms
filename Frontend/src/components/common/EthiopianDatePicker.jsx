import { useState, useEffect } from 'react';
import { ETHIOPIAN_MONTHS, ethToGregorianDate, getEthiopianParts } from '../../utils/dateUtils';

export default function EthiopianDatePicker({ label, value, onChange, error, required }) {
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
            // Default to today if empty and needed?
            const ethToday = getEthiopianParts(new Date());
            if (ethToday) setParts(ethToday);
        }
    }, [value]);

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
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:border-blue-500 outline-none"
                >
                    {[...Array(30).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
                <select
                    value={parts.month}
                    onChange={(e) => handlePartChange('month', e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:border-blue-500 outline-none"
                >
                    {ETHIOPIAN_MONTHS.map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>{m}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={parts.year}
                    onChange={(e) => handlePartChange('year', e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:border-blue-500 outline-none"
                    placeholder="Year"
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
