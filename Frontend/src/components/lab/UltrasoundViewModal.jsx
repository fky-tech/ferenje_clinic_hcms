import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../api/axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function UltrasoundViewModal({ isOpen, onClose, request }) {
    const [testGroups, setTestGroups] = useState({});
    const [selectedTestName, setSelectedTestName] = useState(null);
    const [selectedFinding, setSelectedFinding] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && request) {
            fetchResults();
            setSelectedTestName(null);
            setSelectedFinding(null);
        }
    }, [isOpen, request]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/ultrasound-test-results/request/${request.request_id}`);
            if (res.data && res.data.length > 0) {
                const groups = {};
                res.data.forEach(r => {
                    const tName = r.test_name || 'Ultrasound Study';
                    if (!groups[tName]) groups[tName] = [];
                    groups[tName].push({
                        title: r.title,
                        descriptions: Array.isArray(r.description) ? r.description : [r.description],
                        conclusion: r.conclusion
                    });
                });
                setTestGroups(groups);
            } else {
                setTestGroups({});
            }
        } catch (error) {
            console.error('Error fetching ultrasound results:', error);
            toast.error("Failed to load ultrasound results");
        } finally {
            setLoading(false);
        }
    };

    const hasResults = Object.keys(testGroups).length > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Ultrasound Report: ${request?.FirstName}`} maxWidth="3xl">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-xl text-sm border border-purple-100">
                    <div>
                        <p className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-1">Patient</p>
                        <p className="font-bold text-gray-900 text-base">{request?.FirstName} {request?.Father_Name}</p>
                        <p className="text-gray-500">{request?.Age} yrs • {request?.Sex}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-1">Requested By</p>
                        <p className="font-bold text-gray-900">Dr. {request?.doctor_first_name} {request?.doctor_last_name}</p>
                        <p className="text-gray-500">#{request?.request_id}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading report data...</p>
                    </div>
                ) : !hasResults ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No detailed findings found for this request.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* VIEW: FINDING DETAILS */}
                        {selectedFinding ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSelectedFinding(null)}
                                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center mb-2"
                                >
                                    ← Back to {selectedTestName} Findings
                                </button>
                                <div className="border-l-4 border-purple-400 pl-4 py-1">
                                    <h4 className="font-bold text-sm text-purple-700 uppercase tracking-wider mb-2">{selectedFinding.title}</h4>
                                    <div className="space-y-1">
                                        {selectedFinding.descriptions.map((desc, dIdx) => {
                                            let content = desc;
                                            if (typeof desc === 'object' && desc !== null) {
                                                if (desc.finding) content = desc.finding;
                                                else content = Object.entries(desc).map(([k, v]) => `${k}: ${v}`).join(', ');
                                            }
                                            return (
                                                <div key={dIdx} className="flex items-start gap-2 text-gray-700">
                                                    <span className="mt-2 w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                                                    <p className="text-sm leading-relaxed">{content}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : selectedTestName ? (
                            /* VIEW: TEST'S FINDINGS LIST */
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSelectedTestName(null)}
                                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center mb-2"
                                >
                                    ← Back to Study List
                                </button>

                                <h3 className="font-bold text-gray-800 border-b pb-2">{selectedTestName}</h3>

                                <p className="text-sm text-gray-600 font-medium">Select a finding to view details:</p>
                                <div className="grid gap-3">
                                    {testGroups[selectedTestName].map((finding, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedFinding(finding)}
                                            className="p-4 border border-purple-100 rounded-xl bg-white hover:bg-purple-50 cursor-pointer transition-all flex justify-between items-center shadow-sm group"
                                        >
                                            <span className="font-bold text-gray-800 group-hover:text-purple-700 uppercase tracking-wide">
                                                {finding.title || 'Untitled Finding'}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100">
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Show conclusion for the test if available (taking the first one since it's per test usually) */}
                                {testGroups[selectedTestName][0]?.conclusion && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-6">
                                        <h4 className="font-bold text-sm text-gray-900 uppercase tracking-widest mb-2">Conclusion / Impression</h4>
                                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                            {testGroups[selectedTestName][0].conclusion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* VIEW: TEST LIST */
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 font-medium">Select a study to view findings:</p>
                                <div className="grid gap-3">
                                    {Object.keys(testGroups).map((testName, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedTestName(testName)}
                                            className="p-4 border border-purple-100 rounded-xl bg-white hover:bg-purple-50 cursor-pointer transition-all flex justify-between items-center shadow-sm group"
                                        >
                                            <span className="font-bold text-gray-800 group-hover:text-purple-700 text-lg">
                                                {testName}
                                            </span>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <span>{testGroups[testName].length} Findings</span>
                                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100">
                                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white">
                    <Button variant="secondary" onClick={onClose} className="px-8">Close Report</Button>
                </div>
            </div>
        </Modal>
    );
}
