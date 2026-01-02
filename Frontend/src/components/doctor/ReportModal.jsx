import React, { useState, useEffect } from 'react';
import { X, Search, Check, Save, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ReportModal({ isOpen, onClose, patientData, doctorId, visitId }) {
    const [step, setStep] = useState(1); // 1: Search, 2: Common Morbidity
    const [searchQuery, setSearchQuery] = useState('');
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [selectedIndicators, setSelectedIndicators] = useState(new Set());

    // New State for Dynamic List
    const [morbidityList, setMorbidityList] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    useEffect(() => {
        if (isOpen && patientData) {
            setAge(patientData.Age || '');
            setGender(patientData.Sex || '');
            setStep(1); // Reset step
            setSearchQuery('');
            setSelectedIndicators(new Set());
            fetchIndicators('');
            fetchMorbidityList();
        }
    }, [isOpen, patientData]);

    const fetchMorbidityList = async () => {
        setLoadingList(true);
        try {
            const res = await api.get('/reports/morbidity-list');
            setMorbidityList(res.data);
        } catch (error) {
            console.error('Error fetching morbidity list', error);
            toast.error('Failed to load common morbidity list');
        } finally {
            setLoadingList(false);
        }
    };

    const fetchIndicators = async (query) => {
        setLoading(true);
        try {
            const res = await api.get(`/reports/indicators?search=${query}`);
            setIndicators(res.data);
        } catch (error) {
            console.error('Error fetching indicators', error);
            toast.error('Failed to load indicators');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        fetchIndicators(val);
    };

    const toggleSelection = (indicator) => {
        const code = indicator.indicator_code || indicator.code;
        setSelectedIndicators(prev => {
            const next = new Set(prev);
            if (next.has(code)) {
                next.delete(code);
            } else {
                next.add(code);
            }
            return next;
        });
    };

    const addToMorbidityList = async (indicator) => {
        const loadingToast = toast.loading('Adding to common list...');
        try {
            await api.post('/reports/morbidity-list', {
                code: indicator.indicator_code,
                description: indicator.description
            });
            toast.success('Added to Common Morbidity List', { id: loadingToast });
            fetchMorbidityList(); // Refresh list
        } catch (error) {
            console.error('Error adding to list', error);
            toast.error(error.response?.data?.error || 'Failed to add to list', { id: loadingToast });
        }
    };

    const removeFromMorbidityList = async (e, code) => {
        e.stopPropagation(); // Prevent selection toggle
        if (!window.confirm('Remove this disease from the Common List?')) return;

        const loadingToast = toast.loading('Removing from list...');
        try {
            await api.delete('/reports/morbidity-list', { data: { code } });
            toast.success('Removed from Common List', { id: loadingToast });
            fetchMorbidityList(); // Refresh list
        } catch (error) {
            console.error('Error removing from list', error);
            toast.error('Failed to remove from list', { id: loadingToast });
        }
    };

    const handleBatchSubmit = async () => {
        if (selectedIndicators.size === 0) {
            onClose();
            return;
        }

        if (!age || !gender) {
            toast.error('Please verify Age and Gender');
            return;
        }

        setLoading(true);
        const promises = Array.from(selectedIndicators).map(code => {
            return api.post('/reports/submit', {
                patient_id: patientData.patient_id,
                doctor_id: doctorId,
                indicator_code: code,
                patient_age: age,
                patient_gender: gender,
                visit_id: visitId
            }).catch(err => ({ error: err, code })); // Catch individual errors
        });

        try {
            await Promise.all(promises);
            toast.success(`Reported ${selectedIndicators.size} indicators`);
            onClose();
        } catch (error) {
            console.error('Batch submission error', error);
            toast.error('Some reports may have failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">
                        {step === 1 ? 'Monthly Health Report' : 'Common Morbidity Tally'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Patient Bio Data Header */}
                <div className="p-4 bg-blue-50 border-b grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Patient</span>
                        <span className="font-medium text-gray-900">{patientData?.FirstName} {patientData?.Father_Name}</span>
                    </div>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Age (Years)</label>
                            <input
                                type="number"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                            <select
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    {step === 1 ? (
                        <>
                            <div className="p-4 border-b space-y-3">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search all indicators..."
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors whitespace-nowrap"
                                    >
                                        Common Diseases →
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2">
                                {loading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : indicators.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">No indicators found matching your search.</div>
                                ) : (
                                    <div className="space-y-2 p-2">
                                        {indicators.map((ind) => {
                                            const isSelected = selectedIndicators.has(ind.indicator_code);
                                            // CHECK IF IN COMMON LIST
                                            const isInList = morbidityList.some(item => item.code === ind.indicator_code);

                                            return (
                                                <div key={ind.indicator_code} className={`flex items-center justify-between p-3 border rounded-lg transition-all group ${isSelected ? 'bg-green-50 border-green-200' : 'border-gray-100 hover:bg-blue-50 hover:border-blue-200'}`}>
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-semibold">{ind.indicator_code}</span>
                                                            <span className="text-xs text-gray-400 truncate">{ind.category}</span>
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900 truncate">{ind.description}</div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {!isInList && (
                                                            <button
                                                                onClick={() => addToMorbidityList(ind)}
                                                                title="Add to Common Morbidity List"
                                                                className="p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => toggleSelection(ind)}
                                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center shadow-sm ${isSelected ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                                        >
                                                            {isSelected ? (
                                                                <><Check className="w-4 h-4 mr-1.5" /> Selected</>
                                                            ) : (
                                                                <><Check className="w-4 h-4 mr-1.5" /> Select</>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // Step 2: Common Diseases Checklist - Dynamic
                        <div className="flex flex-col h-full">
                            <div className="p-3 bg-indigo-50 border-b flex justify-between items-center text-sm text-indigo-800 px-4">
                                <span>Specific Morbidity Tally List</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setStep(1)} className="text-indigo-600 hover:underline flex items-center gap-1 group">
                                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Add New
                                    </button>
                                    <button onClick={() => setStep(1)} className="text-indigo-600 hover:underline ml-2">
                                        ← Back to Search
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                {loadingList ? (
                                    <div className="flex justify-center p-4">Loading list...</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {morbidityList.map((ind) => {
                                            const isSelected = selectedIndicators.has(ind.code);
                                            return (
                                                <div key={ind.code} className="relative group/item">
                                                    <button
                                                        onClick={() => toggleSelection({ indicator_code: ind.code })}
                                                        className={`w-full flex flex-col items-start p-4 border rounded-xl transition-all text-left group relative ${isSelected ? 'bg-green-50 border-green-400 shadow-sm' : 'bg-white border-gray-200 hover:shadow-md hover:border-indigo-300 bg-gradient-to-br hover:from-white hover:to-indigo-50'}`}
                                                    >
                                                        <div className="flex justify-between w-full mb-1">
                                                            <span className={`text-sm font-bold ${isSelected ? 'text-green-800' : 'text-gray-900'} pr-6`}>{ind.description}</span>
                                                            <div className={`transition-opacity p-1 rounded-full ${isSelected ? 'opacity-100 bg-green-200' : 'opacity-0 group-hover:opacity-100 bg-indigo-100'}`}>
                                                                <Check className={`w-4 h-4 ${isSelected ? 'text-green-700' : 'text-indigo-600'}`} />
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs font-mono group-hover:text-indigo-400 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>{ind.code}</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => removeFromMorbidityList(e, ind.code)}
                                                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover/item:opacity-100 transition-all z-10 border border-transparent hover:border-red-100"
                                                        title="Remove from list"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* Footer with Batch Submit Button */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 items-center">
                    <div className="text-sm text-gray-500 mr-2">
                        {selectedIndicators.size > 0 ? `${selectedIndicators.size} selected` : 'No items selected'}
                    </div>
                    <button
                        onClick={handleBatchSubmit}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-sm ${selectedIndicators.size > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                    >
                        {selectedIndicators.size > 0 ? 'Submit Selected' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}
