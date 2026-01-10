import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../api/axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function UltrasoundViewModal({ isOpen, onClose, request }) {
    const [findings, setFindings] = useState([]);
    const [conclusion, setConclusion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && request) {
            fetchResults();
        }
    }, [isOpen, request]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/ultrasound-test-results/request/${request.request_id}`);
            if (res.data && res.data.length > 0) {
                setFindings(res.data.map(r => ({
                    title: r.title,
                    descriptions: Array.isArray(r.description) ? r.description : [r.description]
                })));
                setConclusion(res.data[0].conclusion || '');
            }
        } catch (error) {
            console.error('Error fetching ultrasound results:', error);
            toast.error("Failed to load ultrasound results");
        } finally {
            setLoading(false);
        }
    };

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
                ) : findings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No detailed findings found for this request.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {findings.map((finding, idx) => (
                                <div key={idx} className="border-l-4 border-purple-400 pl-4 py-1">
                                    <h4 className="font-bold text-sm text-purple-700 uppercase tracking-wider mb-2">{finding.title}</h4>
                                    <div className="space-y-1">
                                        {finding.descriptions.map((desc, dIdx) => {
                                            let content = desc;
                                            if (typeof desc === 'object' && desc !== null) {
                                                // Handle object description (e.g. { finding: '...' })
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
                            ))}
                        </div>

                        {conclusion && (
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="font-bold text-sm text-gray-900 uppercase tracking-widest mb-2">Conclusion / Impression</h4>
                                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                    {conclusion}
                                </p>
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
