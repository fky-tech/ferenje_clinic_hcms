import { useState } from 'react';
import { AlertTriangle, ClipboardList } from 'lucide-react';

export default function ClinicalNotesForm({ data, onChange, readOnly = false }) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                <ClipboardList className="w-4 h-4 mr-2 text-primary-600" />
                Clinical Notes
            </h3>

            {/* Urgent Attention Toggle */}
            <div className="mb-4 flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="UrgentAttention"
                        checked={data.UrgentAttention === true || data.UrgentAttention === 1}
                        onChange={(e) => onChange({ target: { name: 'UrgentAttention', value: e.target.checked } })}
                        disabled={readOnly}
                        className="form-checkbox h-5 w-5 text-red-600"
                    />
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                        Urgent Attention
                        {data.UrgentAttention && <AlertTriangle className="w-4 h-4 ml-2 text-red-600" />}
                    </span>
                </label>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint (CC)</label>
                    <textarea
                        name="ChiefComplaint"
                        value={data.ChiefComplaint || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        rows={2}
                        className="input-field w-full border rounded p-2"
                        placeholder="Main reason for visit..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">History of Present Illness (HPI)</label>
                    <textarea
                        name="HPI"
                        value={data.HPI || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        rows={4}
                        className="input-field w-full border rounded p-2"
                        placeholder="Detailed history..."
                    />
                </div>
            </div>
        </div>
    );
}
