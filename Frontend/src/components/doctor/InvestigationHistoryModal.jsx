import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FileText, Calendar, AlertCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

export default function InvestigationHistoryModal({ isOpen, onClose, visitHistory, onSelectVisit }) {
    const [selectedVisitId, setSelectedVisitId] = useState(null);

    const handleSelectVisit = (visit) => {
        setSelectedVisitId(visit.visit_id);
        onSelectVisit(visit);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Visit to Add Investigation">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Select a visit to add or update diagnosis, advice, and treatment:
                </p>

                <div className="max-h-96 overflow-y-auto space-y-2">
                    {visitHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>No visit history found</p>
                        </div>
                    ) : (
                        visitHistory.map((visit) => (
                            <div
                                key={visit.visit_id}
                                onClick={() => handleSelectVisit(visit)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedVisitId === visit.visit_id
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium text-gray-900">
                                                {formatDateTime(visit.visit_date || visit.DateOfVisit)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Chief Complaint:</span>{' '}
                                            {visit.ChiefComplaint || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Diagnosis:</span>{' '}
                                            {visit.FinalDiagnosis ? (
                                                <span className="text-green-600">{visit.FinalDiagnosis}</span>
                                            ) : (
                                                <span className="text-orange-500 italic">Not completed</span>
                                            )}
                                        </p>
                                    </div>
                                    <FileText className={`w-5 h-5 ${visit.FinalDiagnosis ? 'text-green-500' : 'text-gray-400'}`} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </Modal>
    );
}
