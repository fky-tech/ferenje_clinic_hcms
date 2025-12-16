import { useState } from 'react';
import { Stethoscope } from 'lucide-react';

export default function PhysicalExamForm({ data, onChange, readOnly = false }) {
    const systems = [
        'HEENT', 'Respiratory System', 'CVS', 'Abdomen', 'GUS', 'CNS', 'Musculoskeletal', 'Integumentary', 'Lymphatic'
    ];

    // Map display names to backend keys
    const systemKeyMap = {
        'HEENT': 'heent',
        'Respiratory System': 'respiratory_system',
        'CVS': 'cvs',
        'Abdomen': 'abdominal_exam',
        'GUS': 'gus',
        'CNS': 'ns',
        'Musculoskeletal': 'mss',
        'Integumentary': 'integumentary', // Backend might not have this, check model
        'Lymphatic': 'lymphatic' // Backend might not have this
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2 text-primary-600" />
                Physical Examination
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">General Appearance</label>
                    <textarea
                        name="general_appearance"
                        value={data.general_appearance || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        rows={2}
                        className="input-field"
                        placeholder="Patient looks..."
                    />
                </div>
                {systems.map(system => {
                    const fieldName = systemKeyMap[system] || system.toLowerCase().replace(/ /g, '_');
                    return (
                        <div key={system}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{system}</label>
                            <textarea
                                name={fieldName}
                                value={data[fieldName] || ''}
                                onChange={onChange}
                                disabled={readOnly}
                                rows={2}
                                className="input-field"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
