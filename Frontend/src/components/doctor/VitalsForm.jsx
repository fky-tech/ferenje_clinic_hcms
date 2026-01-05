import { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import { Activity } from 'lucide-react';

export default function VitalsForm({ data, onChange, readOnly = false }) {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-primary-600" />
                Vital Signs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="BP (Sys/Dia)" name="BloodPressure" type="text" value={data.BloodPressure || data.blood_pressure || ''} onChange={onChange} disabled={readOnly} placeholder="120/80" />
                <Input label="Temp (°C)" name="temperature" type="number" step="0.1" value={data.temperature || ''} onChange={onChange} disabled={readOnly} />
                <Input label="Pulse (bpm)" name="pulse_rate" type="number" value={data.pulse_rate || ''} onChange={onChange} disabled={readOnly} />
                <Input label="Resp Rate" name="respiratory_rate" type="number" value={data.respiratory_rate || ''} onChange={onChange} disabled={readOnly} />
                <Input label="O2 Sat (%)" name="oxygen_saturation" type="number" value={data.oxygen_saturation || ''} onChange={onChange} disabled={readOnly} />
                <Input label="Weight (kg)" name="weight" type="number" step="0.1" value={data.weight || ''} onChange={onChange} disabled={readOnly} />
                {/* <Input label="Height (cm)" name="height" type="number" value={data.height || ''} onChange={onChange} disabled={readOnly} /> */}
                {/* <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">BMI</label>
                    <input
                        type="text"
                        value={data.bmi || ''}
                        disabled
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                </div> */}
            </div>
        </div>
    );
}
